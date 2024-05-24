import React, { useState, useEffect, useContext } from "react";
import "./transactions.css";
import Navbar from "../Navbar/navbar";
import axios from "axios";
import AuthContext from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { authCreds } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authCreds.user_id === 0) {
      navigate('/');
    }else
    axios
      .get(`https://tradethrill.jitik.online:8000/get_transactions/${authCreds.user_id}`)
      // .get(`http://127.0.0.1:8000/get_transactions/${authCreds.user_id}`)
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, [authCreds.user_id]);

  return (
    <>
      <Navbar trans="active" />
      <div className="content-container">
        <h1 className="heading">Your Transactions</h1>
        <div className="transactions-container">
          <div className="transaction-listsold">
            <h2 className="transaction-heading">Items Sold</h2>
            {transactions.sold_results &&
              transactions.sold_results.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-details">
                    <p className="item-name">{transaction.title}</p>
                    <p className="item-description">
                      Description: {transaction.description}
                    </p>
                    <p className="item-cost">Sell Price: Rs.{transaction.cost}</p>
                    <p className="item-id">Buyer Name: {transaction.name}</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="transaction-listbought">
            <h2 className="transaction-heading">Items Bought</h2>
            {transactions.bought_results &&
              transactions.bought_results.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-details">
                    <p className="item-name">{transaction.title}</p>
                    <p className="item-description">
                      Description: {transaction.description}
                    </p>
                    <p className="item-cost">Sell Price: Rs.{transaction.cost}</p>
                    <p className="item-id">Seller Name: {transaction.name}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;
