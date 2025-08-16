import { updatePostItem } from "@redux/reducers/post/post.reducer";

export class ImageUtils {
    static validateFile(file, type) {
        if (type === "image") {
            const validImageTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
            ];
            return file && validImageTypes.indexOf(file.type) > -1;
        } else {
            const validVideoTypes = [
                "video/m4v",
                "video/avi",
                "video/mpg",
                "video/mp4",
                "video/webm",
            ];
            return file && validVideoTypes.indexOf(file.type) > -1;
        }
    }

    static checkFileSize(file, type) {
        let fileError = "";
        const isValid = ImageUtils.validateFile(file, type);
        if (!isValid) {
            fileError = `File "${file.name}" không đúng định dạng. Vui lòng chọn các file hợp lệ.`;
        }
        if (file.size > 50000000) {
            fileError = `File "${file.name}" quá lớn. Kích thước tối đa cho phép là 50MB.`;
        }
        return fileError;
    }

    static checkFile(file, type) {
        const error = ImageUtils.checkFileSize(file, type);
        if (error) {
            window.alert(error);
            return false;
        }
        return true;
    }

    static async addFileToRedux(event, post, setSelectedImage, dispatch, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Kiểm tra file có hợp lệ không
        const isValid = ImageUtils.checkFile(file, type);
        if (!isValid) {
            event.target.value = ""; // Xóa giá trị file input
            return; // Thoát nếu file không hợp lệ
        }

        setSelectedImage(file);
        dispatch(
            updatePostItem({
                image: type === "image" ? URL.createObjectURL(file) : "",
                video: type === "video" ? URL.createObjectURL(file) : "",
                gifUrl: "",
                imgId: "",
                imgVersion: "",
                videoId: "",
                videoVersion: "",
                post,
            })
        );
    }

    static readAsBase64(file) {
        const reader = new FileReader();
        const fileValue = new Promise((resolve, reject) => {
            reader.addEventListener("load", () => {
                resolve(reader.result);
            });

            reader.addEventListener("error", (event) => {
                reject(event);
            });

            reader.readAsDataURL(file);
        });
        return fileValue;
    }

    static getBackgroundImageColor(imageUrl) {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        const backgroundImageColor = new Promise((resolve, reject) => {
            image.addEventListener("load", () => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);

                const imageData = context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                const params = imageData.data;
                const bgColor = ImageUtils.convertRGBToHex(
                    params[0],
                    params[1],
                    params[2]
                );
                resolve(bgColor);
            });

            image.src = imageUrl;
        });
        return backgroundImageColor;
    }

    static convertRGBToHex(red, green, blue) {
        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        red = red.length === 1 ? "0" + red : red;
        green = green.length === 1 ? "0" + green : green;
        blue = blue.length === 1 ? "0" + blue : blue;
        return `#${red}${green}${blue}`;
    }
}
