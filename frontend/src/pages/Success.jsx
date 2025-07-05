import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('');

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');

    if (responseCode === '00') {
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  return (
    <div className="thank-you-container">
      <h1>
        {status === 'success'
          ? 'Thanh toán thành công!'
          : 'Thanh toán thất bại hoặc bị huỷ.'}
      </h1>
    </div>
  );
};

export default ThankYou;
