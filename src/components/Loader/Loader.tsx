type LoaderProps = {
  loading: boolean;
};

function Loader({ loading }: LoaderProps) {
  if (!loading) return null;

  return <div className="loader">Loading...</div>;
}

export default Loader;
