import React from 'react';
import { useSavings } from '../../hooks/useSavings';
import './CategoryCard.css';

const SavingsCategory = ({ onValueChange }) => {
    const { 
        accounts, 
        totalSavingsValue, 
        isLoading, 
        error,
        ready, 
        open,
        disconnectBank
    } = useSavings();

    // Update parent wanneer totalSavingsValue verandert
    React.useEffect(() => {
        onValueChange(totalSavingsValue);
    }, [totalSavingsValue, onValueChange]);

    const handleDisconnect = async () => {
        console.log('Disconnect button clicked');
        if (window.confirm('Weet je zeker dat je je bank wilt ontkoppelen?')) {
            try {
                console.log('Starting disconnect process...');
                await disconnectBank();
                console.log('Disconnect successful, reloading...');
                window.location.reload();
            } catch (err) {
                console.error('Error in handleDisconnect:', err);
                setError('Kon bank niet ontkoppelen: ' + err.message);
            }
        }
    };

    return (
        <div className="savings-content">
            {accounts.length === 0 ? (
                <button 
                    type="button"
                    onClick={() => ready && open()}
                    className={`connect-bank-button ${(!ready || isLoading) ? 'disabled' : ''}`}
                    disabled={!ready || isLoading}
                >
                    {isLoading ? 'Laden...' : 'Verbind je bank'}
                </button>
            ) : (
                <div className="accounts-list">
                    <div className="accounts-header">
                        <h3>Gekoppelde rekeningen</h3>
                        <button 
                            onClick={handleDisconnect}
                            className="disconnect-button"
                            disabled={isLoading}
                            style={{ cursor: 'pointer' }}
                        >
                            {isLoading ? 'Bezig met ontkoppelen...' : 'Ontkoppel bank'}
                        </button>
                    </div>
                    {accounts.map(account => (
                        <div key={account.account_id} className="savings-item">
                            <div className="savings-item-header">
                                <span className="account-name">{account.name}</span>
                                <span className="account-type">
                                    {account.subtype === 'savings' ? 'Spaarrekening' : 'Betaalrekening'}
                                </span>
                            </div>
                            <div className="savings-item-balance">
                                <span className="balance-amount">
                                    €{account.balances.current.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                    <button 
                        onClick={() => window.location.reload()} 
                        className="retry-button"
                    >
                        Probeer opnieuw
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavingsCategory; 