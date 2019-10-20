import React from "react";

/* Validate review form*/
const validateForm = (errors, nickname, score, description) => {
  let valid = true;
  if (nickname == null || score == null || description == null) {
    valid = false;
  }
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

class Restaurant extends React.Component {
  state = {
    isLoaded: false,
    validIndex: false,
    title: null,
    image: null,
    description: null,
    score: null,
    reviews: [],
    updatedAt: null,
    errors: {
      nickname: "",
      score: "",
      description: ""
    },
    inputNickname: null,
    inputScore: null,
    inputDescription: null
  };

  async componentDidMount() {
    /* Fetch API and set states */
    const { params } = this.props.match;
    const url = "https://dps-fe-test-api.herokuapp.com/" + params.id;
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.setState({
        title: data.data.title,
        image: data.data.image,
        description: data.data.description,
        score: data.meta.calculated_score,
        reviews: data.data.reviews,
        updatedAt: data.meta.updated_at,
        validIndex: true,
        isLoaded: true
      });
    } catch (err) {
      this.setState({
        isLoaded: true,
        validIndex: false
      });
    }
    /* Set new meta tags */
    document.title = this.state.title;
  }

  /* handle review form input changes */
  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "inputNickname":
        errors.nickname =
          value.length >= 3 ? "" : "nickname must be 3 characters or longer!";
        break;
      case "inputScore":
        errors.score = (value > 0) & (value < 10) ? "" : "Score is not valid!";
        break;
      case "inputDescription":
        errors.description =
          value.length <= 0 ? "Cooment must not be empty!" : "";
        break;
      default:
        break;
    }
    this.setState({ errors, [name]: value });
  };

  /* handle review form submit */
  handleSubmit = event => {
    event.preventDefault();
    if (
      validateForm(
        this.state.errors,
        this.state.inputNickname,
        this.state.inputScore,
        this.state.inputDescription
      )
    ) {
      console.info("Valid Form");
    } else {
      console.error("Invalid Form");
    }
  };

  /* Set duration of last updated */
  setDuration(milli){
      let minutes = Math.floor(milli / 60000);
      let hours = Math.round(minutes / 60);
      let days = Math.round(hours / 24);
      let years = Math.round(days / 365);
      if (years !== 0) {
        return "Last updated " + years + " years ago";
      }
      if (days !== 0) {
        return "Last updated " + days + " days ago";
      } else if (hours !== 0) {
        return "Last updated " + hours + " hours ago";
      } else if (minutes !== 0) {
        return "Last updated " + minutes + " minutes ago";
      } else {
        return "Last updated less than a minute ago";
      }
  }

  
    /* create star elements for user review  */
    createStars(score) {
      const starRating = score / 2;
      let stars = [];
      for (let i = 0; i < Math.floor(starRating); i++) {
        stars.push(<i key={stars.length} className="fa fa-star"></i>);
      }
      if (starRating % 1 !== 0)
        stars.push(
          <i
            key={stars.length}
            className="fa fa-star-half-o"
            aria-hidden="true"
          ></i>
        );
      for (let i = 0; i < 5 - Math.round(starRating); i++) {
        stars.push(
          <i key={stars.length} className="fa fa-star-o" aria-hidden="true"></i>
        );
      }
      return stars;
    }


    /* Set tool tip rating values  */
    createRating(score) {
      let rating = "";
      switch (true) {
        case score <= 1:
          rating = "Awful";
          break;
        case score <= 3:
          rating = "Poor";
          break;
        case score <= 5:
          rating = "Okay";
          break;
        case score <= 7:
          rating = "Good";
          break;
        case score <= 8:
          rating = "Great";
          break;
        case score <= 10:
          rating = "Amazing";
          break;
        default:
          rating = "You have plenty of gas.";
      }
      return rating;
    }
    
  render() {
    /* display when loading */
    if (!this.state.isLoaded) {
      return <div className="loading">Loading...</div>;
    }

    /* display when Invalid Index */
    if (!this.state.validIndex && this.state.isLoaded) {
      return <div className="invalid-index">Invalid Index</div>;
    }

    const { errors } = this.state;

    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-8 order-lg-2 mb-4">
            <div className="card">
              <img
                src={this.state.image}
                className="card-img-top"
                id="image"
                alt={this.state.title + " restaurant"}
              />
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <h1 className="card-title restaurant-name" id="title">
                      {this.state.title}
                    </h1>
                  </div>
                  <div className="col-3">
                    <div className="float-right">
                      <div className="score-box">
                        <h6 id="score">
                          <span className="score-total">
                            {Math.round(this.state.score * 10) / 10}
                          </span>{" "}
                          /10
                        </h6>
                      </div>
                      <p className="card-text text-center">
                        <small className="text-muted" id="score-reviews">
                          {this.state.reviews.length} Reviews
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
                <p className="card-text" id="description">
                  {this.state.description}
                </p>
                <p className="card-text">
                  <small className="text-muted" id="lastupdated">
                    {this.setDuration(this.state.updatedAt)}
                  </small>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-12  order-lg-5  mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Reviews</h2>
                <div className="card-text">
                  {this.state.reviews.map((review, index) => (
                    <div className="media mb-4" key={index}>
                      <img
                        src={review.avatar}
                        className="mr-3 avatar"
                        height="64"
                        width="64"
                        alt={review.author + "'s avatar"}
                      />
                      <div className="media-body">
                        <div className="row no-gutter">
                          <div className="col-7">
                            <h3 className="mt-0">{review.author}</h3>
                          </div>
                          <div className="col-5">
                            <div className="float-right rating-tooltip">
                              <h4
                                className="score-user"
                                data-html="true"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Hooray!"
                              >
                                {this.createStars(review.score)} ({review.score}/10)
                              </h4>
                              <span className="rating-tooltiptext">
                                {this.createRating(review.score)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.description}
                      </div>
                    </div>
                  ))}
                  ;
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 order-lg-3">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Leave a review</h2>
                <p className="card-text">
                  If you have a few minutes, please share your experience at
                  {this.state.title}
                </p>
                <div className="card-text mb-2">
                  <form onSubmit={this.handleSubmit} noValidate>
                    <div className="form-group">
                      <label htmlFor="reviewNickname">Nickname</label>
                      <input
                        type="email"
                        className="form-control"
                        id="reviewNickname"
                        name="inputNickname"
                        onChange={this.handleChange}
                      />
                      {errors.nickname.length > 0 && (
                        <span className="error">{errors.nickname}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="reviewScore">
                        Review Score (Out of 10)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="reviewScore"
                        min="1"
                        max="10"
                        name="inputScore"
                        onChange={this.handleChange}
                      />
                      {errors.score.length > 0 && (
                        <span className="error">{errors.score}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="reviewDescription">Comment</label>
                      <textarea
                        className="form-control"
                        id="reviewDescription"
                        name="inputDescription"
                        onChange={this.handleChange}
                      />
                      {errors.description.length > 0 && (
                        <span className="error">{errors.description}</span>
                      )}
                    </div>
                    <input
                      className="btn btn-primary"
                      type="submit"
                      value="Submit"
                    />
                  </form>
                </div>
                <p className="card-text">
                  <small className="text-muted">
                    <a
                      onClick={() => {
                        alert(
                          "1) We are not liable for anything \n 2) We take no responsibility for the theft of your data \n 3) You cannot sue us"
                        );
                      }}
                      href="#"
                    >
                      Click here for our terms and conditions
                    </a>
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Restaurant;
