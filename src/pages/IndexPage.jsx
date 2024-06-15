import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/indexPage.scss";

const IndexPage = () => {
  return (
    <>
      <Header />
      <div className="IndexPage">
        <div className="indexContentBox">
          <div className="boardBox box">
            <div className="iconBox">
              <img src="images/board.jpg" alt="게시글 등록 아이콘" />
            </div>
            <div className="detailBox">
              <div className="TT">BOARD</div>
              <p>손쉽게 게시글을 작성하고 공유해보세요.</p>
            </div>
          </div>
          <div className="calendarBox box">
            <div className="iconBox">
              <img src="images/calendar.jpg" alt="가계부 관리 아이콘" />
            </div>
            <div className="detailBox">
              <div className="TT">CALENDAR</div>
              <p>캘린더를 통해 가계부를 관리하세요.</p>
            </div>
          </div>
          <div className="postBox box">
            <div className="iconBox">
              <img src="images/post.jpg" alt="쪽지 아이콘" />
            </div>
            <div className="detailBox">
              <div className="TT">POST</div>
              <p>친구들에게 쪽지를 보내보세요.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IndexPage;
