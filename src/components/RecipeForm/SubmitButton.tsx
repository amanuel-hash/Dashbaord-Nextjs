const SubmitButton = ({ mode, isLoading }: any) => (
  <div className="text-center">
    <button
      type="submit"
      disabled={isLoading}
      className="min-w-[80px] rounded bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          Submitting...
        </div>
      ) : mode === "edit" ? "Update Recipe" : "Submit Recipe"}
    </button>
  </div>
);

export default SubmitButton;