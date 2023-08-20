import React from "react";import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faComment, faThumbsUp, faThumbsDown } from "@fortawesome/fontawesome-free-solid";

function Post({ post }) {
  return (
    <div className="tl-post">
                <div className="tl-ps-header">
                  <div className="tl-ps-foto">
                    <img
                      src={post.userPhoto}
                      alt=""
                    />
                  </div>
                  <div className="tl-ps-nomes">
                    <p className="tl-ps-nome">
                    {post.userName} <span className="tl-ps-user">{post.user} </span>
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
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
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
  );
}

export default Post;