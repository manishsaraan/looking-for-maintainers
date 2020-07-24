import React, { useRef } from 'react';

type SubscribeType = {
  subscribe: (email: string, name: string) => any;
  subState: any;
};

const Subscribe = (props: SubscribeType) => {
  const emailRef: any = useRef();
  const nameRef: any = useRef();
  const { loading, error, success } = props.subState;

  const onSubscribeSubmit = (event: any) => {
    event.preventDefault();

    props.subscribe(emailRef.current.value, nameRef.current.value);
  };

  if (success) {
    emailRef.current.value = '';
    nameRef.current.value = '';
  }

  return (
    <form className="load-email__form" id="contact-form">
      {success && <span>{success}</span>}
      <div className="load-email__form-item">
        <input
          className="load-email-enter"
          placeholder="Enter your name :)"
          type="text"
          name="name"
          ref={nameRef}
        />
      </div>
      <div className="load-email__form-item">
        <input
          className="load-email-enter"
          placeholder="Enter your email :)"
          type="email"
          name="email"
          ref={emailRef}
        />
      </div>
      {error && <span style={{ color: 'red' }}>{error}</span>}
      <div className="load-email__form-item txtcenter">
        <button
          type="submit"
          className="load-email-button button-primary"
          onClick={onSubscribeSubmit}
        >
          {loading ? 'Subscribing' : 'Subscribe'}
        </button>
      </div>
    </form>
  );
};

export default Subscribe;
