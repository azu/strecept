import React, { useState } from "react";

type ReceiptFormProps = {
  initialValues: { title?: string; url?: string };
  onSubmit: ({ title, url }: { title: string; url: string }) => void;
};

const ReceiptForm = ({ initialValues, onSubmit }: ReceiptFormProps) => {
  const [state, setState] = useState({
    title: initialValues?.title ?? "",
    url: initialValues?.url ?? "",
  });
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(state);
      }}
    >
      <input type="text" placeholder="title" name={"title"} value={state.title} onChange={handleChange} />
      <input type="url" placeholder="https://exampole.com" name={"url"} value={state.url} onChange={handleChange} />
      <button>Submit</button>
    </form>
  );
};

export default ReceiptForm;
