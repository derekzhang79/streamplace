
import React from "react";
import dot from "dot-object";
import Twixty from "twixtykit";

import ArcCreate from "../arcs/ArcCreate";
import SK from "../../SK";
import style from "./VertexCreate.scss";

import RTMPOutputCreator from "./creators/RTMPOutputCreator";
import RTMPInputCreator from "./creators/RTMPInputCreator";
import MagicCreator from "./creators/MagicCreator";
import ImageInputCreator from "./creators/ImageInputCreator";
import FileOutputCreator from "./creators/FileOutputCreator";

export default class VertexCreate extends React.Component {
  constructor(params) {
    super(params);
    this.state = {
      chosen: null
    };
  }

  render() {
    const options = Object.keys(vertexCreators).map((name) => {
      const pick = () => {
        this.setState({chosen: name});
      };
      const className = this.state.chosen === name ? style.VertexCreatorSelected : "";
      return (
        <li key={name}>
          <a className={className} onClick={pick}>{name}</a>
        </li>
      );
    });
    const Chosen = vertexCreators[this.state.chosen] || "br";
    return (
      <section className={style.VertexCreate}>
        <div>
          <h2>New Vertex</h2>
          <ul>
            {options}
          </ul>
        </div>
        <Chosen broadcastId={this.props.broadcastId} />
      </section>
    );
  }
}

const vertexCreators = {
  RTMPInputCreator,
  RTMPOutputCreator,
  MagicCreator,
  ArcCreate,
  ImageInputCreator,
  FileOutputCreator,
};

VertexCreate.propTypes = {
  broadcastId: React.PropTypes.string.isRequired
};
