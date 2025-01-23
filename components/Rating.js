import React from 'react';
import Rating from 'react-rating'; // Assuming you're using a rating library like `react-rating`

class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.placeholderRating || 0 }; // Initialize the value from props

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ value: undefined }); // Reset the rating to undefined
  }

  render() {
    return (
      <div>
        <Rating {...this.props} initialRating={this.state.value} />
        <button onClick={this.handleClick}>Reset</button>
      </div>
    );
  }
}

export default Rating;
