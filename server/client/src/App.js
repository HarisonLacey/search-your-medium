import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Logo image

import headphone from "./headphone.png";

// Boostrap imports

import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Component where app is constructed

class App extends Component {
  constructor(props) {
    super(props);
    this.favourite = this.favourite.bind(this);
    this.display = this.display.bind(this);
    this.state = {
      media: "",
      term: "",
      result: [],
      count: "",
      favourite: [],
      noShow: "",
    };
  }

  // Fecthes Itunes API data based on user's search terms and retruns results into state

  view = async () => {
    const media = this.state.media;
    const term = this.state.term;
    const response = await fetch(
      `https://itunes.apple.com/search?term=${term}&media=${media}&limit=50`
    );
    await response
      .json()
      .then((res) =>
        this.setState({ result: res.results, count: res.resultCount })
      );
  };

  // Fetches our API and sends user's favourite choices

  add = async (e) => {
    e.target.style.borderColor = "lightgreen";
    e.target.style.backgroundColor = "lightgreen";
    await fetch("/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favourite: {
          favourite: e.target.value,
        },
      }),
    });
  };

  // Maps out search results for the user to view

  display() {
    const array = this.state.result;
    const count = this.state.count;
    if (count === 0) {
      return (
        <div>
          <h4 className="noShow">Nothing to show :(</h4>
          <h4 className="leftShow">Maybe refine your search :)</h4>
        </div>
      );
    } else {
      return array.map((e) => (
        <div className="container">
          <div className="info">
            <Image
              className="image"
              src={e.artworkUrl100}
              alt="cover"
              thumbnail
            />
            <div className="title">
              <h4>{e.artistName}</h4>
              <p>{e.collectionName}</p>
              <p>{e.trackName}</p>
              <Button
                className="button"
                variant="outline-secondary"
                size="sm"
                value={
                  e.artistName + " | " + e.collectionName + " | " + e.trackName
                }
                onClick={this.add}
              >
                Add to Favourites
              </Button>
              <a
                href={e.trackViewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="button"
                  variant="outline-secondary"
                  size="sm"
                >
                  Listen
                </Button>
              </a>
            </div>
          </div>
        </div>
      ));
    }
  }

  // Fetches user's favourite selection and sets it in the component state

  viewFave = async (e) => {
    e.target.style.borderColor = "lightgreen";
    e.target.style.backgroundColor = "lightgreen";
    const response = await fetch("/get");
    await response
      .json()
      .then((res) => res)
      .then((res) => this.setState({ favourite: res.array }));
  };

  // Maps out user's favourite choices and maps it out for them to see

  favourite() {
    let array = this.state.favourite;
    return array.map((e) => (
      <div className="faveBox">
        <h4>{e.favourite}</h4>
        <Button
          className="deleteButton"
          size="sm"
          variant="danger"
          value={array.indexOf(e)}
          onClick={this.delete}
        >
          Delete
        </Button>
      </div>
    ));
  }

  // Delete user's favourite from our API

  delete = async (e) => {
    const index = e.target.value;
    this.state.favourite.splice(index, 1);
    this.setState({ favourite: this.state.favourite });
    const response = await fetch("/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favourite: this.state.favourite,
      }),
    });
  };

  render() {
    return (
      <div>
        <div className="searchBox">
          <select onChange={(e) => this.setState({ media: e.target.value })}>
            <option value="">All</option>
            <option value="movie">Movie</option>
            <option value="podcast">Podcast</option>
            <option value="music">Music</option>
            <option value="musicVideo">Music Video</option>
            <option value="audiobook">Audiobook</option>
            <option value="shortFilm">Short Film</option>
            <option value="tvShow">TV Show</option>
            <option value="software">Software</option>
          </select>
          <InputGroup className="search">
            <FormControl
              placeholder="Search Your Medium..."
              onChange={(e) => this.setState({ term: e.target.value })}
            />
            <InputGroup.Append>
              <Button onClick={this.view} variant="outline-secondary">
                Search
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        <Container fluid>
          <Row>
            <Col className="col" sm={8}>
              <div>{this.display()}</div>
              <img className="logo" src={headphone} alt="headphone" />
            </Col>
            <Col className="col col-right" sm={4}>
              <h4 className="noFave">{this.state.noShow}</h4>
              <div>{this.favourite()}</div>
              <Button
                className="view-button"
                variant="outline-secondary"
                onClick={this.viewFave}
              >
                View Favourites
              </Button>
            </Col>
          </Row>
        </Container>
        <footer></footer>
      </div>
    );
  }
}

export default App;
