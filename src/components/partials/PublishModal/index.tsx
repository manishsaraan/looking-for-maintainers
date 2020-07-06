import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Spinner from '../Spinner';
import UserRepo from '../Repo';
import './PublishModal.css';

function PublishMoal(props: any) {
  const inputRef: any = React.useRef();
  const { repos, loading } = props.userGithubRepos;

  let message = null;

  if (!props.intialLoad && !loading) {
    message = (
      <div className="no-repo-message">No Un-Published Repos Found</div>
    );
  }

  return (
    <div className="publish-modal-container">
      <Modal
        size="lg"
        show={props.show}
        onHide={props.handleClose}
        animation={false}
        dialogClassName="publish-modal"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Fetch GitHub Repostories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-body row no-gutters align-items-center">
            <div className="col-auto">
              <i className="fa fa-search h4 text-body" />
            </div>
            <div className="col">
              <input
                className="form-control form-control-lg form-control-borderless"
                id="search"
                type="search"
                placeholder="Search repositories"
                ref={inputRef}
              />
            </div>
            <div className="col-auto">
              <button
                onClick={() => props.findRepos(inputRef.current.value)}
                className="btn btn-lg search-repo-button"
                type="submit"
              >
                {loading ? <Spinner /> : 'Search'}
              </button>
            </div>
          </div>
          {repos.length > 0
            ? repos.map((repo: any, index: number) => (
                <UserRepo
                  updateRepoStatus={props.updateRepoStatus}
                  repo={repo}
                  key={repo.id}
                  isChecked={repo.isChecked}
                  index={index + 1}
                />
              ))
            : message}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default PublishMoal;
