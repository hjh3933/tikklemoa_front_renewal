import React, { useEffect, useState } from "react";
import "../styles/imgModal.scss";

const ImgModal = ({ src, alt, onClose }) => {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="modalImage" />
      </div>
    </div>
  );
};

export default ImgModal;
