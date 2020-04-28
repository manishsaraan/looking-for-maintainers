import React, { useRef } from "react";

type SubscribeType = {
  subscribe: (email: string, cb: any) => any;
};

const Subscribe = (props: SubscribeType) => {
  const [loading, updateLoading] = React.useState(false);
  const emailRef: any = useRef();

  const onSubscribeSubmit = (event: any) => {
    event.preventDefault();

    updateLoading(true);
    props.subscribe(emailRef.current.value, () => {
      emailRef.current.value = "";
      updateLoading(false);
    });
  };

  return (
    <form className="load-email__form" id="contact-form">
      <div className="load-email__form-item">
        <input
          className="load-email-enter"
          placeholder="Enter your email :)"
          type="email"
          name="email"
          ref={emailRef}
        />
      </div>
      <div className="load-email__form-item txtcenter">
        <button
          type="submit"
          className="load-email-button button-primary"
          onClick={onSubscribeSubmit}
        >
          {loading ? "Subscribing" : "Subscribe"}
        </button>
      </div>
    </form>
  );
};

export default Subscribe;
