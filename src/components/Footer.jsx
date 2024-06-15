import { Link } from "react-router-dom";
import "../styles/footer.scss";

const Footer = () => {
  return (
    <>
      {/* <h2>footer</h2> */}
      <div className="footerBox">
        <div className="navBox">
          <div className="contentOne">
            <div className="title">project tikklemoa</div>
            <div>period: 2024.05.31 - 2024.06.19</div>
            <div>member: 홍주희(1인)</div>
            <div>email: hkh3933@naver.com</div>
          </div>
          <div className="contentTwo">
            <div className="title">repository</div>
            <div>
              <a href="https://github.com/hjh3933/tikklemoa_front" target="_blank">
                https://github.com/hjh3933/tikklemoa_front
              </a>
            </div>
            <div>
              <a href="https://github.com/hjh3933/tikklemoa_back" target="_blank">
                https://github.com/hjh3933/tikklemoa_back
              </a>
            </div>
          </div>
          <div className="contentThree">
            <div className="title">stacks</div>
            <div>front: react, node.js, jsx, sass, react-calendar, chart.js etc</div>
            <div>back: springboot, jpa, aws, s3, mysql, jwt etc</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
