/**
 * Fact Checking Service
 * 
 * This service provides fact-checking capabilities for blog content using:
 * 1. Google Fact Check Tools API (free tier)
 * 2. ClaimBuster API (academic/research use)
 * 3. Local claim detection using NLP patterns
 * 4. Web search verification via Google Custom Search API
 */

interface FactCheckResult {
  claim: string;
  rating: 'true' | 'false' | 'mixture' | 'unverified' | 'disputed' | 'unknown';
  ratingLabel?: string;
  confidence: number; // 0-100
  sources: {
    name: string;
    url: string;
    date?: string;
    excerpt?: string;
  }[];
  explanation?: string;
  checkDate: string;
}

interface FactCheckReport {
  overallScore: number; // 0-100
  credibilityLevel: 'high' | 'medium' | 'low' | 'very-low';
  totalClaims: number;
  verifiedClaims: number;
  falseClaiims: number;
  unverifiedClaims: number;
  claims: FactCheckResult[];
  analysisDate: string;
  warnings: string[];
  recommendations: string[];
}

class FactCheckService {
  private readonly GOOGLE_FACT_CHECK_API = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';
  private readonly CLAIMBUSTER_API = 'https://idir.uta.edu/claimbuster/api/v2/score/text';
  
  // You'll need to add these to your .env file
  private readonly GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_FACT_CHECK_API_KEY;
  private readonly GOOGLE_CUSTOM_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_API_KEY;
  private readonly GOOGLE_CUSTOM_SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

  /**
   * Extract potential factual claims from content
   */
  private extractClaims(content: string): string[] {
    const claims: string[] = [];
    
    // Split content into sentences (improved splitting)
    const sentences = content
      .replace(/([.?!])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 15); // Lowered from 20 to catch more

    console.log('🔍 Total sentences found:', sentences.length);

    // Patterns that indicate factual claims (expanded)
    const claimPatterns = [
      // Research/Studies
      /\b(according to|research shows|studies show|data shows|statistics show|reports indicate)\b/i,
      /\b(it is (a )?fact|the fact is|in fact)\b/i,
      
      // Numbers and prices
      /\b(\d{1,3}[,.]?\d*)\s*(dollars?|pounds?|euros?|£|\$|€)\b/i,
      /\b£?\$?€?\d{1,3}[,.]\d{3}[,.]\d{3}\b/i, // Large numbers like £250,000
      /\b(\d{1,2}%|\d+[,.]\d+%)\b/i, // Percentages
      
      // Statistics and counts
      /\b\d+\s*(people|users|individuals|deaths|cases|customers|cars|vehicles)\b/i,
      
      // Authority claims
      /\b(scientists|researchers|experts|doctors|professionals|mechanics|engineers)\s+(say|claim|found|discovered|prove|recommend)\b/i,
      
      // Causal claims
      /\b(causes|caused by|results in|leads to|increases|decreases|reduces|improves)\b/i,
      
      // Absolute statements
      /\b(always|never|all|none|every|no one|everyone|nobody)\b/i,
      
      // Verification words
      /\b(proven|confirmed|verified|established|guaranteed|certified)\b/i,
      
      // Comparisons and market claims
      /\b(better than|worse than|faster than|cheaper than|more expensive|less expensive|best|worst)\b/i,
      /\b(isn't|is not|aren't|are not)\s+(always|the)\b/i, // "isn't always"
      
      // Product/service claims
      /\b(loses value|gains value|depreciates|appreciates)\b/i,
    ];

    for (const sentence of sentences) {
      // Check if sentence contains claim indicators
      const hasClaimPattern = claimPatterns.some(pattern => pattern.test(sentence));
      
      // Check if sentence contains numbers or statistics
      const hasNumbers = /\d+/.test(sentence);
      const hasStatistics = /\d+[,.]?\d*\s*(%|percent|million|billion|thousand|hundred)/i.test(sentence);
      const hasMoney = /\$|€|£|dollars?|pounds?|euros?/i.test(sentence);
      
      // Check if sentence makes a definitive statement
      const isDefinitive = /(is|are|was|were|will|has|have|isn't|aren't|don't|doesn't)\s+\w+/i.test(sentence);
      
      // Check for comparative or absolute statements
      const isComparative = /(better|worse|more|less|most|least|best|worst|always|never)/i.test(sentence);

      // More lenient detection
      const shouldInclude = (
        (hasClaimPattern && sentence.length < 300) ||
        (hasStatistics && sentence.length < 300) ||
        (hasMoney && hasNumbers && sentence.length < 300) ||
        ((isDefinitive || isComparative) && hasNumbers && sentence.length < 300)
      );

      if (shouldInclude) {
        console.log('✅ Claim detected:', sentence.substring(0, 100));
        claims.push(sentence);
      }
    }

    console.log('📊 Total claims extracted:', claims.length);
    return claims.slice(0, 10); // Limit to top 10 claims
  }

  /**
   * Check a single claim using Google Fact Check Tools API
   */
  private async checkClaimWithGoogle(claim: string): Promise<FactCheckResult | null> {
    if (!this.GOOGLE_API_KEY) {
      console.warn('Google Fact Check API key not configured');
      return null;
    }

    try {
      const params = new URLSearchParams({
        key: this.GOOGLE_API_KEY,
        query: claim,
        languageCode: 'en'
      });

      console.log('🔍 Calling Google Fact Check API for claim:', claim.substring(0, 100));
      const response = await fetch(`${this.GOOGLE_FACT_CHECK_API}?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google Fact Check API error: ${response.status}`, errorText);
        throw new Error(`Google Fact Check API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Google API Response:', data);

      if (data.claims && data.claims.length > 0) {
        const factCheck = data.claims[0];
        const claimReview = factCheck.claimReview?.[0];

        console.log('📊 Found claim review:', claimReview);

        if (claimReview) {
          return {
            claim: factCheck.text || claim,
            rating: this.normalizeRating(claimReview.textualRating),
            ratingLabel: claimReview.textualRating,
            confidence: this.calculateConfidence(claimReview),
            sources: [{
              name: claimReview.publisher?.name || 'Unknown',
              url: claimReview.url || '',
              date: claimReview.reviewDate,
              excerpt: factCheck.claimant
            }],
            explanation: claimReview.title,
            checkDate: new Date().toISOString()
          };
        }
      } else {
        console.log('ℹ️ No claims found in Google database for:', claim.substring(0, 50));
      }

      return null;
    } catch (error) {
      console.error('❌ Error checking claim with Google:', error);
      return null;
    }
  }

  /**
   * Use ClaimBuster API to score claim worthiness
   */
  private async scoreClaimWithClaimBuster(claim: string): Promise<number> {
    try {
      console.log('🎯 Calling ClaimBuster API for claim:', claim.substring(0, 100));
      const response = await fetch(`${this.CLAIMBUSTER_API}/${encodeURIComponent(claim)}`);
      
      if (!response.ok) {
        console.warn('ClaimBuster API returned error, using default score');
        return 0.5; // Default neutral score
      }

      const data = await response.json();
      console.log('✅ ClaimBuster score:', data.score);
      return data.score || 0.5;
    } catch (error) {
      console.error('❌ Error scoring claim with ClaimBuster:', error);
      return 0.5;
    }
  }

  /**
   * Perform web search to verify claim
   */
  private async verifyClaimWithWebSearch(claim: string): Promise<FactCheckResult | null> {
    if (!this.GOOGLE_CUSTOM_SEARCH_API_KEY || !this.GOOGLE_CUSTOM_SEARCH_ENGINE_ID) {
      console.log('ℹ️ Custom Search API not configured, skipping web search');
      return null;
    }

    try {
      const searchQuery = `${claim} fact check OR verify OR truth`;
      const params = new URLSearchParams({
        key: this.GOOGLE_CUSTOM_SEARCH_API_KEY,
        cx: this.GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
        q: searchQuery,
        num: '5'
      });

      console.log('🔎 Calling Custom Search API for claim:', claim.substring(0, 100));
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
      
      if (!response.ok) {
        console.warn('Custom Search API returned error');
        return null;
      }

      const data = await response.json();
      console.log('✅ Custom Search found', data.items?.length || 0, 'results');

      if (data.items && data.items.length > 0) {
        const trustedDomains = [
          'snopes.com',
          'factcheck.org',
          'politifact.com',
          'reuters.com/fact-check',
          'apnews.com/ap-fact-check',
          'bbc.com/news/reality_check',
          'fullfact.org',
          'factcheck.afp.com'
        ];

        const factCheckSources = data.items.filter((item: { link: string }) => 
          trustedDomains.some(domain => item.link.includes(domain))
        );

        console.log('📰 Found', factCheckSources.length, 'fact-check sources');

        if (factCheckSources.length > 0) {
          return {
            claim,
            rating: 'unverified',
            confidence: 50,
            sources: factCheckSources.map((item: { link: string; snippet: string }) => ({
              name: new URL(item.link).hostname,
              url: item.link,
              excerpt: item.snippet
            })),
            explanation: 'Found fact-checking sources for verification',
            checkDate: new Date().toISOString()
          };
        }
      }

      return null;
    } catch (error) {
      console.error('❌ Error verifying claim with web search:', error);
      return null;
    }
  }

  /**
   * Normalize different rating formats to standard values
   */
  private normalizeRating(rating: string): FactCheckResult['rating'] {
    const lowerRating = rating?.toLowerCase() || '';
    
    if (lowerRating.includes('true') || lowerRating.includes('correct') || lowerRating.includes('accurate')) {
      return 'true';
    }
    if (lowerRating.includes('false') || lowerRating.includes('incorrect') || lowerRating.includes('inaccurate')) {
      return 'false';
    }
    if (lowerRating.includes('mixture') || lowerRating.includes('mostly') || lowerRating.includes('partially')) {
      return 'mixture';
    }
    if (lowerRating.includes('disputed') || lowerRating.includes('contested')) {
      return 'disputed';
    }
    if (lowerRating.includes('unverified') || lowerRating.includes('unproven')) {
      return 'unverified';
    }
    
    return 'unknown';
  }

  /**
   * Calculate confidence score based on fact check data
   */
  private calculateConfidence(claimReview: { publisher?: { name?: string }; reviewDate?: string }): number {
    let confidence = 70; // Base confidence

    // Increase confidence for known publishers
    const trustedPublishers = ['Snopes', 'PolitiFact', 'FactCheck.org', 'Reuters', 'AP'];
    if (trustedPublishers.some(p => claimReview.publisher?.name?.includes(p))) {
      confidence += 20;
    }

    // Recent reviews are more confident
    if (claimReview.reviewDate) {
      const reviewDate = new Date(claimReview.reviewDate);
      const daysSinceReview = (Date.now() - reviewDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceReview < 90) confidence += 10;
    }

    return Math.min(100, confidence);
  }

  /**
   * Analyze blog content and generate fact check report
   */
  async checkBlogContent(content: string, title?: string): Promise<FactCheckReport> {
    console.log('🚀 Starting fact check analysis...');
    console.log('📝 Content length:', content.length, 'characters');
    console.log('🔑 API Key configured:', !!this.GOOGLE_API_KEY);
    console.log('🔍 Custom Search configured:', !!this.GOOGLE_CUSTOM_SEARCH_API_KEY);
    
    const fullText = title ? `${title}. ${content}` : content;
    
    // Extract potential claims
    console.log('🔎 Extracting claims from content...');
    const extractedClaims = this.extractClaims(fullText);
    console.log('📊 Found', extractedClaims.length, 'potential claims');
    
    if (extractedClaims.length > 0) {
      console.log('Claims extracted:', extractedClaims.map(c => c.substring(0, 80) + '...'));
    }
    
    if (extractedClaims.length === 0) {
      console.log('⚠️ No factual claims detected');
      return {
        overallScore: 50,
        credibilityLevel: 'medium',
        totalClaims: 0,
        verifiedClaims: 0,
        falseClaiims: 0,
        unverifiedClaims: 0,
        claims: [],
        analysisDate: new Date().toISOString(),
        warnings: ['No factual claims detected in the content'],
        recommendations: ['Content appears to be primarily opinion-based or narrative']
      };
    }

    // Check each claim
    const claimResults: FactCheckResult[] = [];
    
    console.log('🔍 Starting verification of', extractedClaims.length, 'claims...');
    
    for (let i = 0; i < extractedClaims.length; i++) {
      const claim = extractedClaims[i];
      console.log(`\n--- Checking claim ${i + 1}/${extractedClaims.length} ---`);
      console.log('Claim:', claim.substring(0, 100));
      
      // Try Google Fact Check first
      let result = await this.checkClaimWithGoogle(claim);
      
      // If no result, try web search verification
      if (!result) {
        console.log('⏭️ Google Fact Check found nothing, trying web search...');
        result = await this.verifyClaimWithWebSearch(claim);
      }
      
      // If still no result, score with ClaimBuster
      if (!result) {
        console.log('⏭️ No web results, using ClaimBuster scoring...');
        const claimScore = await this.scoreClaimWithClaimBuster(claim);
        result = {
          claim,
          rating: 'unverified',
          confidence: Math.round(claimScore * 100),
          sources: [],
          explanation: claimScore > 0.7 
            ? 'High claim-worthiness detected - requires fact-checking'
            : 'Low claim-worthiness - likely opinion or general statement',
          checkDate: new Date().toISOString()
        };
      }
      
      if (result) {
        console.log('✅ Result:', result.rating, `(${result.confidence}% confidence)`);
        claimResults.push(result);
      }
    }

    console.log('\n📊 Analysis complete! Processing results...');
    console.log('Total results:', claimResults.length);

    // Calculate overall statistics
    const verifiedClaims = claimResults.filter(c => c.rating === 'true').length;
    const falseClaims = claimResults.filter(c => c.rating === 'false').length;
    const mixtureClaims = claimResults.filter(c => c.rating === 'mixture').length;
    const unverifiedClaims = claimResults.filter(c => c.rating === 'unverified' || c.rating === 'unknown').length;

    console.log('✅ Verified (TRUE):', verifiedClaims);
    console.log('❌ False:', falseClaims);
    console.log('⚠️ Mixture:', mixtureClaims);
    console.log('❓ Unverified:', unverifiedClaims);

    // Calculate overall score
    let overallScore = 50;
    if (claimResults.length > 0) {
      const trueWeight = verifiedClaims * 100;
      const mixtureWeight = mixtureClaims * 50;
      const falseWeight = falseClaims * 0;
      const unverifiedWeight = unverifiedClaims * 50;
      
      overallScore = Math.round(
        (trueWeight + mixtureWeight + falseWeight + unverifiedWeight) / claimResults.length
      );
    }

    console.log('🎯 Overall Score:', overallScore);

    // Determine credibility level
    let credibilityLevel: FactCheckReport['credibilityLevel'] = 'medium';
    if (overallScore >= 80) credibilityLevel = 'high';
    else if (overallScore >= 50) credibilityLevel = 'medium';
    else if (overallScore >= 30) credibilityLevel = 'low';
    else credibilityLevel = 'very-low';

    console.log('🏆 Credibility Level:', credibilityLevel);

    // Generate warnings and recommendations
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (falseClaims > 0) {
      warnings.push(`Found ${falseClaims} potentially false claim(s)`);
      recommendations.push('Review and verify claims marked as false before publishing');
    }

    if (unverifiedClaims > claimResults.length * 0.5) {
      warnings.push(`${unverifiedClaims} claims could not be verified`);
      recommendations.push('Consider adding sources or citations for unverified claims');
    }

    if (overallScore < 50) {
      warnings.push('Overall credibility score is below acceptable threshold');
      recommendations.push('Significant fact-checking and revision recommended');
    }

    if (claimResults.length > 5 && verifiedClaims === 0) {
      warnings.push('No claims could be verified against fact-checking databases');
      recommendations.push('Add citations to reputable sources to improve credibility');
    }

    console.log('⚠️ Warnings:', warnings.length);
    console.log('💡 Recommendations:', recommendations.length);
    console.log('✅ Fact check complete!\n');

    return {
      overallScore,
      credibilityLevel,
      totalClaims: claimResults.length,
      verifiedClaims,
      falseClaiims: falseClaims,
      unverifiedClaims,
      claims: claimResults,
      analysisDate: new Date().toISOString(),
      warnings,
      recommendations
    };
  }

  /**
   * Quick content scan for obvious red flags
   */
  async quickScan(content: string): Promise<{
    hasRedFlags: boolean;
    flags: string[];
    suggestions: string[];
  }> {
    const flags: string[] = [];
    const suggestions: string[] = [];

    // Check for sensationalist language
    const sensationalWords = [
      /shocking/gi, /unbelievable/gi, /miracle/gi, /secret/gi, /banned/gi,
      /doctors hate/gi, /one weird trick/gi, /they don't want you to know/gi
    ];
    
    for (const pattern of sensationalWords) {
      if (pattern.test(content)) {
        flags.push('Contains sensationalist language');
        suggestions.push('Consider using more neutral, factual language');
        break;
      }
    }

    // Check for lack of sources
    const hasSources = /according to|source:|citation|reference|study|research/i.test(content);
    if (!hasSources && content.length > 500) {
      flags.push('No sources or citations detected');
      suggestions.push('Add references to support factual claims');
    }

    // Check for all-caps excessive use
    const allCapsWords = content.match(/\b[A-Z]{4,}\b/g);
    if (allCapsWords && allCapsWords.length > 5) {
      flags.push('Excessive use of ALL CAPS');
      suggestions.push('Use normal capitalization for better readability');
    }

    // Check for excessive exclamation marks
    const exclamationCount = (content.match(/!/g) || []).length;
    if (exclamationCount > 10) {
      flags.push('Excessive use of exclamation marks');
      suggestions.push('Use exclamation marks sparingly for emphasis');
    }

    return {
      hasRedFlags: flags.length > 0,
      flags,
      suggestions
    };
  }
}

export const factCheckService = new FactCheckService();
export type { FactCheckReport, FactCheckResult };
