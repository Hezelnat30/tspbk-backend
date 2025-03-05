const formatDate = (date: Date | string) => {
  return new Date(date).toISOString().split("T")[0];
};

export { formatDate };
