import React, { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Image from "next/image";

const ImageViewer = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="relative flex items-center justify-center">
            {currentIndex > 0 && (
                <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-4xl text-white hover:text-gray-300"
                >
                    ❮
                </button>
            )}
            <div className="relative w-[50vw] h-[50vh]">
                {images[currentIndex] && images[currentIndex].trim() !== "" ? (
                    <Zoom>
                        <Image
                            src={images[currentIndex]}
                            alt={`Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </Zoom>
                ) : (
                    <p className="text-white">No image available</p>
                )}
            </div>
            {currentIndex < images.length - 1 && (
                <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-4xl text-white hover:text-gray-300"
                >
                    ❯
                </button>
            )}
        </div>
    );
};

export default ImageViewer;