import { useEffect, useState } from "react";
import axios from '../utils/axiosInstance';
import { Card, Col, Row, Typography, Tag, Button, List, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const PlanManager = () => {
  const [plans, setPlans] = useState([]);
  const [saving, setSaving] = useState(false); 
  const userId = localStorage.getItem('userId');

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/plans');
      const formattedPlans = response.data.map((plan, index) => {
        const price = Number(plan.price) || 0;
        const sale = Number(plan.salePrice) || 0;
        const discounted = Math.round(price - (price * sale) / 100);
        const saved = Math.round((price * sale) / 100);
        const utilities = [
          { text: "Xuất bản nhanh", checked: plan.maxProperties > 50 },
          { text: "Hẹn giờ đăng tin", checked: plan.utilities?.schedulePost || false },
          { text: "Báo cáo hiệu suất", checked: plan.utilities?.performanceReport || false },
          { text: "Thao tác với nhiều tin", checked: plan.maxProperties > 20 }
        ];
        return {
          ...plan,
          price,
          sale,
          discounted,
          saved,
          utilities,
          pushPosts: plan.pushPosts || 0,
          bestSeller: index === 1
        };
      });
      setPlans(formattedPlans);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách gói:', error);
      message.error('Không tải được danh sách gói');
    }
  };

  const handlePayment = async (plan) => {
    if (!userId) {
      return message.error("Bạn cần đăng nhập để thanh toán.");
    }

    try {
      const payload = {
        user: userId,
        plan: plan._id,
        amount: plan.discounted,
        language: 'vn'
      };

      const res = await axios.post('/api/payment/create-payment', payload);
      const url = res.data?.paymentUrl;
      if (url) {
        window.location.href = url;
      } else {
        message.error("Không lấy được liên kết thanh toán.");
      }
    } catch (err) {
      console.error('Lỗi thanh toán:', err);
      message.error("Đã xảy ra lỗi khi tạo thanh toán.");
    }
  };

  const handleSavePlan = async (plan) => {
    if (!userId) {
      return message.error("Bạn cần đăng nhập để lưu gói.");
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return message.error("Token không tồn tại, vui lòng đăng nhập lại.");
    }

    setSaving(true);
    try {
      const payload = {
        planId: plan._id,
        userId: userId 
      };
      const res = await axios.post('/api/plans/save', payload);
      message.success(res.data.thongBao || 'Lưu gói thành công!');
    } catch (err) {
      console.error('Lỗi khi lưu gói:', err);
      message.error(err.response?.data?.thongBao || 'Lỗi khi lưu gói');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <Row gutter={24} style={{ padding: 24 }}>
      {plans.map((plan, index) => (
        <Col xs={24} md={8} key={index}>
          <Card
            title={
              <>
                <Title level={4}>{plan.name}</Title>
                {plan.bestSeller && (
                  <Tag color="gold" style={{ marginLeft: 8 }}>
                    Bán chạy nhất
                  </Tag>
                )}
              </>
            }
            variant="outlined"
            style={{ height: '100%' }}
          >
            <Paragraph>{plan.description?.replace(/<\/?[^>]+(>|$)/g, "") || "Không có mô tả"}</Paragraph>

            <Paragraph>
              <Text strong style={{ fontSize: '1.2em', color: '#f5222d' }}>
                từ {plan.discounted.toLocaleString('vi-VN')} đ/tháng
              </Text>{' '}
              <Text type="secondary">(-{plan.sale || 0}%)</Text>
            </Paragraph>

            {plan.sale > 0 && (
              <Paragraph type="success">
                Tiết kiệm đến {plan.saved.toLocaleString('vi-VN')} đ mỗi tháng
              </Paragraph>
            )}

            <Button type="primary" danger block onClick={() => handlePayment(plan)} style={{ marginBottom: 20 }}>
              Thanh toán qua VNPAY
            </Button>
            <Button type="default" block onClick={() => handleSavePlan(plan)} loading={saving}>
              Lưu gói tin đăng ký
            </Button>

            <Title level={5}>Gói tin hàng tháng</Title>
            {[
              { label: "Tin VIP Vàng (hiển thị 7 ngày)", value: Number(plan.vipGold) || 0 },
              { label: "Tin VIP Bạc (hiển thị 7 ngày)", value: Number(plan.vipSilver) || 0 },
              { label: "Tin Thường (hiển thị 10 ngày)", value: Number(plan.regularPosts) || 0 },
              { label: "Lượt đẩy cho Tin Thường", value: Number(plan.pushPosts) || 0 }
            ].map((item, idx) => {
              const checked = item.value > 0;
              return (
                <div key={idx} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  {checked ? (
                    <CheckOutlined style={{ color: 'green', marginRight: 8 }} />
                  ) : (
                    <CloseOutlined style={{ color: 'gray', marginRight: 8 }} />
                  )}
                  <Text delete={!checked} type={!checked ? "secondary" : undefined}>
                    {checked ? `${item.value} ${item.label}` : item.label}
                  </Text>
                </div>
              );
            })}

            <Title level={5}>Tiện ích</Title>
            <List
              dataSource={plan.utilities}
              renderItem={(item, idx) => (
                <List.Item key={idx}>
                  {item.checked ? (
                    <CheckOutlined style={{ color: 'green', marginRight: 8 }} />
                  ) : (
                    <CloseOutlined style={{ color: 'gray', marginRight: 8 }} />
                  )}
                  <Text delete={!item.checked}>{item.text}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PlanManager;
