import { useRef, useState } from "react";
import { icons } from "@assets/assets";
import { Image, X } from "lucide-react";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";

const SearchInputDesktop = ({
    onClick,
    searchTerm,
    setSearchTerm,
    onImageSelect,
}) => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                if (onImageSelect) {
                    onImageSelect(reader.result);
                }
                setImagePreview(reader.result);
                setShowImagePreview(true);
                // Cập nhật searchTerm để hiển thị đang tìm kiếm bằng hình ảnh
                setSearchTerm("Searching by image...");
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
        setShowImagePreview(false);
        setSearchTerm("");
    };

    const onClickSearch = () => {
        removeImage(); // Xóa hình ảnh đã chọn
        onClick();
    };

    return (
        <div className="relative">
            <div className="relative flex items-center py-3 rounded-xl max-w-2/3 overflow-hidden shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                <div
                    title="Search"
                    onClick={onClick}
                    className="h-full absolute flex items-center left-4 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                    <DynamicSVG
                        svgData={icons.search}
                        className={`size-6 object-cover`}
                    />
                </div>
                <input
                    onKeyDown={(e) => e.key === "Enter" && onClick()}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Find friends, communicate..."
                    className="input border-gray-300 pl-12 pr-9 h-6 rounded-xl w-72 transition-all duration-300 focus:w-96 outline-none ring-0"
                    name="search"
                    type="search"
                />

                {/* Thêm icon tìm kiếm bằng hình ảnh */}
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <div
                        onClick={fileInputClicked}
                        className="size-6 flex place-content-center cursor-pointer transition-all duration-300 hover:scale-105"
                        title="Search by image"
                    >
                        <img
                            src={icons.search_image}
                            alt="Search by image"
                            className="size-full object-cover"
                        />
                    </div>

                    {imageFile && !showImagePreview && (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs text-blue-600">1</span>
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
                </div>
            </div>

            {/* Image Preview */}
            {showImagePreview && imagePreview && (
                <div className="absolute top-12 right-0 z-50 bg-white rounded-lg shadow-lg p-3 mt-2 w-64 max-h-96 overflow-y-auto">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Search preview"
                            className="w-full h-auto object-cover rounded-md cursor-pointer"
                            onClick={() => setIsZoomed(true)} // Optional: Open image in a new tab or modal
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
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={onClickSearch}
                            className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md text-sm font-medium"
                        >
                            Search with this image
                        </button>
                    </div>
                </div>
            )}

            {isZoomed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setIsZoomed(false)}
                >
                    <img
                        src={imagePreview}
                        alt="zoomed"
                        className="max-w-6xl max-h-full rounded-lg shadow-lg transition-transform duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchInputDesktop;
