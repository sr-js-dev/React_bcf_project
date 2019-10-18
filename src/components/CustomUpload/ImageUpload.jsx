import React from "react";
import Button from "components/CustomButtons/Button.jsx";
import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: this.props.avatar ? defaultAvatar : defaultImage
    };
  }
  fileInput = React.createRef();
  handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };
  handleSubmit = e => {
    e.preventDefault();
  };
  handleClick = () => {
    this.fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      file: null,
      imagePreviewUrl: this.props.avatar ? defaultAvatar : defaultImage
    });
    this.fileInput.current.value = null;
  };
  render() {
    var {
      avatar,
      addButtonProps,
      changeButtonProps,
      removeButtonProps
    } = this.props;
    return (
      <div className="fileinput text-center">
        <input
          type="file"
          onChange={this.handleImageChange}
          ref={this.fileInput}
        />
        <div className={"thumbnail" + (avatar ? " img-circle" : "")}>
          <img src={this.state.imagePreviewUrl} alt="..." />
        </div>
        <div>
          {(!this.state.file) ? (
            <Button color="primary" {...addButtonProps} onClick={() => this.handleClick()}>
              {avatar ? "Add Photo" : "Select image"}
            </Button>
          ) : (
            <span>
              <Button {...changeButtonProps} onClick={() => this.handleClick()}>
                Change
              </Button>
              {avatar ? <br /> : null}
              <Button
                color="danger"
                {...removeButtonProps}
                onClick={() => this.handleRemove()}
              >
                <i className="fas fa-times" /> Remove
              </Button>
            </span>
          )}
        </div>
      </div>
    );
  }
}

