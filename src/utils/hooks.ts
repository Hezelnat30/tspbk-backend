const formatDate = (date: Date | string) => {
  return new Date(date).toISOString().split("T")[0];
};

const toDataUrl = (file: Express.Multer.File) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataUrl = `data:${file.mimetype};base64,${b64}`;
  return dataUrl;
};

const getPublicIdFromFileUrl = (fileUrl: string) => {
  const fileNameUsingSubstring = fileUrl.substring(
    fileUrl.lastIndexOf("/") + 1
  );
  const publicId = fileNameUsingSubstring.substring(
    0,
    fileNameUsingSubstring.lastIndexOf(".")
  );
  return publicId;
};

export { formatDate, toDataUrl, getPublicIdFromFileUrl };
