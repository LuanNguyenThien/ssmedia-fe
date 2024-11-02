import React from 'react';
import '@pages/social/groups/group.scss';
import PostForm from '@components/posts/post-form/PostForm';

const Group = () => {
  return (
    <div className="group-container">
      {/* Khung tìm kiếm bên trái */}
      <div className="group-search">
        <h3>Your Group</h3>
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
            <div
              className="group-background"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80)`
              }}
            ></div>
            <div className="group-info-wrapper">
              <h2 className="group-name">groupName</h2>

              <button className="join-group-button">Join Group</button>
            </div>
          </div>
        </div>

        <div className="group-main">
          {/* Bài Post ở bên trái */}
          <div className="group-post">
            <PostForm />
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
