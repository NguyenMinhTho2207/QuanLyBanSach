export const isJsonString = (data) => {
    try {
        JSON.parse(data);
    } catch (error) {
        return false;
    }

    return true;
}

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const convertPrice = (price) => {
  try {
    if (price) {
      const result  = Number(price).toLocaleString('vi-VN');
      return `${result} VNĐ`
    }

    return 0;
  } catch (error) {
    return 0
  }
}