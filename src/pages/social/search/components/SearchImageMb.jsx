import { useRef, useState } from "react";
import { icons } from "@assets/assets";
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchImageTab = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const fileInputClicked = () => {
        fileInputRef.current.click();
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSearch = () => {
        if (imagePreview) {
            // Navigate to the current search page with the image data
            navigate(location.pathname, {
                state: {
                    query: "",
                    image: imagePreview,
                    hasImage: true
                }
            });
        }
    };

    return (
        <div className="mb-4 p-4 bg-white rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Search by Image</h2>
            
            <div className="flex flex-col items-center">
                {!imagePreview ? (
                    <div 
                        onClick={fileInputClicked}
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                        <img src={icons.search_image} alt="" className="w-12 h-12 mb-2" />
                        <p className="text-gray-500 text-sm text-center">
                            Tap to select an image to search
                        </p>
                    </div>
                ) : (
                    <div className="relative w-full">
                        <img
                            src={imagePreview}
                            alt="Search preview"
                            className="w-full h-auto object-cover rounded-md cursor-pointer max-h-48"
                            onClick={() => setIsZoomed(true)}
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            title="Remove image"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                    onClick={() => {
                        if (fileInputRef.current) {
                            fileInputRef.current.value = null;
                        }
                    }}
                />

                {imagePreview && (
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md text-sm font-medium"
                    >
                        Search with this image
                    </button>
                )}
            </div>

            {isZoomed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setIsZoomed(false)}
                >
                    <img
                        src={imagePreview}
                        alt="zoomed"
                        className="max-w-full max-h-screen p-4 rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchImageTab;