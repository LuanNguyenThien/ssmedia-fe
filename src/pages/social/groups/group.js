import React from 'react';
import '@pages/social/groups/group.scss';
import Posts from '@components/posts/Posts';
const Group = () => {
  return (
    <div className="group-container">
      {/* Khung tìm kiếm bên trái */}
      <div className="group-search">
        <input type="text" placeholder="Tìm kiếm nhóm..." />

        {/* Thẻ kết quả tìm kiếm */}
        <div className="search-results">
          <div className="result-item">Kết quả 1</div>
          <div className="result-item">Kết quả 2</div>
          <div className="result-item">Kết quả 3</div>
          {/* Có thể thêm nhiều kết quả hơn nếu cần */}
        </div>
      </div>

      {/* Thông tin nhóm và bài post */}
      <div className="group-content">
        <div className="group-info">
          <div className="group-header">
            <div className="group-background"></div>
            <h2 className="group-name">Tên Nhóm</h2>
          </div>
        </div>

        <div className="group-main">
          {/* Bài Post ở bên trái */}
          <div className="group-post">
            <h3>Bài Post</h3>
            <div className="post-content">
              <p>Đây là nội dung của bài post. Bạn có thể cập nhật, chia sẻ và tương tác với bài post này.</p>
            </div>
          </div>

          {/* Khung About Group và Nội Quy Nhóm bên phải */}
          <div className="group-side">
            <div className="group-about">
              <h3>About Group</h3>
              <p>Đây là phần mô tả về nhóm, bao gồm thông tin về mục đích, quy định và các thông tin liên quan.</p>
            </div>

            <div className="group-rules">
              <h3>Nội Quy Nhóm</h3>
              <ul>
                <li>Quy định 1: Không spam hoặc quảng cáo không liên quan.</li>
                <li>Quy định 2: Tôn trọng các thành viên khác.</li>
                <li>Quy định 3: Không chia sẻ nội dung vi phạm pháp luật.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
