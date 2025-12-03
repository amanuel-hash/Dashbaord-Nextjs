export function getErrorMessage(error, fallback = "Something went wrong") {
  if (error && typeof error === "object" && "response" in error) {
    console.log("error", error);
    const errObj = error;
    return (
      errObj.response?.data?.message || errObj.response?.data?.msg || fallback
    );
  }
  return fallback;
}
