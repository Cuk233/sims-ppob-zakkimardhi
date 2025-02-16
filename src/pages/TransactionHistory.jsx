import { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { transactionService } from '../services';
import MainLayout from '../components/layout/MainLayout';
import ProfileBalanceInfo from '../components/ProfileBalanceInfo';
import Button from '../components/Button';

const { Title, Text } = Typography;

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const limit = 5;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTransactions = async (currentOffset) => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactionHistory(limit, currentOffset);
      
      if (response.data.records) {
        if (currentOffset === 0) {
          setTransactions(response.data.records);
        } else {
          setTransactions(prev => [...prev, ...response.data.records]);
        }
        
        // Check if we have more transactions to load
        setHasMore(response.data.records.length === limit);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(0);
  }, []);

  const handleShowMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchTransactions(newOffset);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat('id-ID').format(Math.abs(amount));
    return `${type === 'credit' ? '+' : '-'} Rp${formattedAmount}`;
  };

  return (
    <MainLayout>
      {/* Profile and Balance Section */}
      <ProfileBalanceInfo />

      {/* Transaction History Section */}
      <div style={{ 
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Title level={4} style={{ 
          marginBottom: '24px',
          fontSize: isMobile ? '20px' : '24px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          Semua Transaksi
        </Title>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {transactions.map((transaction, index) => (
            <div
              key={`${transaction.invoice_number}-${index}`}
              className="transaction-item"
              style={{
                padding: isMobile ? '12px' : '16px',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                background: '#FFFFFF'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'center' : 'flex-start',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '8px' : 0
              }}>
                <div>
                  <Text className="amount" style={{ 
                    fontSize: isMobile ? '12px' : '14px',
                    color: transaction.transaction_type === 'TOPUP' ? '#1A9E75' : '#FF0000',
                    fontWeight: 600,
                    display: 'block'
                  }}>
                    {formatAmount(
                      transaction.total_amount,
                      transaction.transaction_type === 'TOPUP' ? 'credit' : 'debit'
                    )}
                  </Text>
                  <Text className="date" style={{ 
                    fontSize: isMobile ? '10px' : '12px', 
                    color: '#666666' 
                  }}>
                    {formatDate(transaction.created_on)}
                  </Text>
                </div>
                <Text className="description" style={{ 
                  fontSize: isMobile ? '12px' : '14px', 
                  color: '#1A1A1A',
                  textAlign: isMobile ? 'center' : 'right'
                }}>
                  {transaction.description}
                </Text>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '24px',
            marginBottom: isMobile ? '32px' : '40px'
          }}>
            <Button
              variant="outline"
              onClick={handleShowMore}
              loading={loading}
              fullWidth={isMobile}
            >
              Show More
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TransactionHistory; 