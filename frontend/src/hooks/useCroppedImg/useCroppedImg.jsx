const useCroppedImg = () => {
  const createImg = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const croppedImg = async (imageSrc, pixelCrop) => {
    const canvas = document.createElement("canvas");
    const image = await createImg(imageSrc);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }

    const safeArea = Math.sqrt(image.width ** 2 + image.height ** 2);

    canvas.width = safeArea;
    canvas.height = safeArea;
    
    ctx.drawImage(
      image,
      (safeArea - image.width) / 2,
      (safeArea - image.height) / 2
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width / 2 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height / 2 - pixelCrop.y)
    );

    const dataURL = canvas.toDataURL("image/jpeg", 0.3);

    return dataURL;
  };
  return { croppedImg };
};

export default useCroppedImg
