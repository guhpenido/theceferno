import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/fontawesome-free-solid";
import { faThumbsUp } from "@fortawesome/fontawesome-free-solid";
import { faThumbsDown } from "@fortawesome/fontawesome-free-solid";
import { faCaretDown } from "@fortawesome/fontawesome-free-solid";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import "./stylesTimeline.css";

export function Timeline() {
  return (
    <div className="tl-container">
      <div className="tl-header">
        <div className="tl-header1">
          <div className="tl-foto">
            <img
              src="https://cdn.discordapp.com/attachments/871728576972615680/1142350249776648262/image.png"
              alt=""
            />
          </div>
          <div className="tl-logo">
            <img
              src="https://cdn.discordapp.com/attachments/871728576972615680/1142335297980477480/Ceferno_2.png"
              alt=""
            />
          </div>
        </div>
        <div className="tl-titulo">
          <h1>Timeline</h1>
        </div>
      </div>
      <div className="tl-main">
        <div className="tl-box">
          <div className="tl-post">
            <div className="tl-ps-header">
              <div className="tl-ps-foto">
                <img
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1142349089133047868/image.png"
                  alt=""
                />
              </div>
              <div className="tl-ps-nomes">
                <p className="tl-ps-nome">
                  Stella <span className="tl-ps-user">@tellaswift </span>
                  <span className="tl-ps-tempo">• 42s</span>
                  <FontAwesomeIcon className="arrow" icon={faArrowRight} />
                  <img
                    src="https://cdn.discordapp.com/attachments/871728576972615680/1142348920949833829/image.png"
                    alt=""
                  />{" "}
                  Kettles{" "}
                  <span className="tl-ps-userReceived">@eokettles </span>
                </p>
              </div>
            </div>
            <div className="tl-ps-texto">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </div>
            <div className="tl-ps-footer">
              <div className="tl-ps-opcoes">
                <div className="tl-ps-reply">
                  <FontAwesomeIcon icon={faComment} />
                  <span>10</span>
                </div>
                <div className="tl-ps-like">
                  <FontAwesomeIcon icon={faThumbsUp} /> <span>10</span>
                </div>
                <div className="tl-ps-deslike">
                  <FontAwesomeIcon icon={faThumbsDown} />
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
          <div className="tl-post">
            <div className="tl-ps-header">
              <div className="tl-ps-foto">
                <img
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1142349089133047868/image.png"
                  alt=""
                />
              </div>
              <div className="tl-ps-nomes">
                <p className="tl-ps-nome">
                  Stella <span className="tl-ps-user">@tellaswift </span>
                  <span className="tl-ps-tempo">• 1h</span>
                </p>
              </div>
            </div>
            <div className="tl-ps-texto">Esse é meu primeiro post.</div>
            <div className="tl-ps-footer">
              <div className="tl-ps-opcoes">
                <div className="tl-ps-reply">
                  <FontAwesomeIcon icon={faComment} />
                  <span>10</span>
                </div>
                <div className="tl-ps-like">
                  <FontAwesomeIcon icon={faThumbsUp} /> <span>10</span>
                </div>
                <div className="tl-ps-deslike">
                  <FontAwesomeIcon icon={faThumbsDown} />
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tl-addpost">
        <img
          src="https://cdn.discordapp.com/attachments/871728576972615680/1142352433352294482/asa.png"
          alt=""
        />
      </div>
      <div className="tl-footer">
        <div>
        <FontAwesomeIcon className="tl-icon-footer" icon={faThumbsDown} />
        </div>
        <div>
          <FontAwesomeIcon className="tl-icon-footer" icon={faThumbsDown} />
        </div>
        <div>
          <FontAwesomeIcon className="tl-icon-footer" icon={faThumbsDown} />
        </div>
        <div>
          <FontAwesomeIcon className="tl-icon-footer" icon={faThumbsDown} />
        </div>
      </div>
    </div>
  );
}
