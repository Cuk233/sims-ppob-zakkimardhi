import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';
import { transactionService } from '../services';
import { useModal } from '../components/modals/ModalProvider';
import Button from '../components/Button';

const Payment = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const { openModalSuccess, openModalError } = useModal();

  const handlePayment = async () => {
    try {
      await transactionService.payment({
        service_code: 'ELECTRICITY',
        amount: parseInt(amount)
      });

      openModalSuccess({
        title: 'Pembayaran Berhasil',
        content: `Pembayaran listrik prabayar sebesar Rp${amount} berhasil`,
        okText: 'Kembali ke Beranda',
        onOk: () => navigate('/')
      });
    } catch (error) {
      openModalError({
        title: 'Pembayaran Gagal',
        content: error.message || 'Terjadi kesalahan saat melakukan pembayaran',
        okText: 'Kembali ke Beranda',
        onOk: () => navigate('/')
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Listrik Prabayar</h1>

      <Input
        placeholder="Masukan nominal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-4"
      />

      <Button
        variant="primary"
        onClick={handlePayment}
        fullWidth
      >
        Bayar
      </Button>
    </div>
  );
};

export default Payment; 