import React from "react";
import CelestialEventModal from "../../components/Learner/CelestialEventModal";
import type { CelestialEvent } from "./Celestial_Events_Page";

interface Comment {
  id: number;
  user: string;
  rating: number;
  text: string;
}

interface CelestialEventModelProps {
  open: boolean;
  onClose: () => void;
  event: {
    title: string;
    date: string;
    category: string;
    description: string;
    locations: string[];
  };
  comments: Comment[];
  onAddComment: (comment: { rating: number; text: string }) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  modalClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  closeClassName?: string;
  infoClassName?: string;
  detailsClassName?: string;
}

const CelestialEventModel: React.FC<CelestialEventModelProps> = (props) => {
  return <CelestialEventModal {...props} />;
};

export default CelestialEventModel;
