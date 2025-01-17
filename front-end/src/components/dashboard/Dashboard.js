import React, { Component } from "react";
import Sidebar from "./sidebar";
import "../../Style/Dashboard.css";
import axios from "axios";
import Row from "./Row";

let today = new Date();
let currentDate =
  today.getDate() +
  "-" +
  parseInt(today.getMonth() + 1) +
  "-" +
  today.getFullYear();

export class Dashboard extends Component {
  state = {
    name: "Mohammad Obeidat",
    balance: 0,
    currency: "JD",
    expenses: [],
    newExpense: {
      date: currentDate,
      title: "",
      value: 0
    }
  };

  //@METHOD GET
  //Return All Expenses From Database.
  getExpenses = () => {
    axios
      .get(`/expenses/${this.props.userData[0]._id}`)
      .then(response => {
        console.log("RESPONSE.DATA.EXPENSES :", response.data.expenses);
        this.setState({ expenses: response.data.expenses });
      })
      .catch(error => {
        console.log("NO DATA FETCHED :", error);
      });
  };

  //@METHOD POST
  //Add New Expense to Database.
  addExpenses = (newExpense, clearInputs) => {
    newExpense.date = Date.now();
    newExpense.user_id = this.props.userData[0]._id;
    axios
      .post("/expenses", newExpense)
      .then(response => {
        this.setState({ expenses: response.data.expenses });
      })
      .catch(error => {
        console.log("NO DATA FETCHED :", error);
      });
    clearInputs();
    this.getExpenses();
  };

  addSalaryHandler = () => {
    console.log(this.props.userData[0]._id);
    axios
      .post("/salary", { id: this.props.userData[0]._id })
      .then(response => {
        console.log(response.data);
        let x = response.data[0].balance;
        let y = response.data[0].saving;
        this.setState({ balance: x, saving: y });
      })
      .catch(error => {
        console.log("NO DATA FETCHED :", error);
      });
  };

  //@METHOD PUT
  //Update Specific Expense.
  updateExpenses = (expenseID, newData, clearInputs) => {
    axios
      .put(`/expenses/${expenseID}`, newData)
      .then(response => {
        this.setState({
          expenses: response.data
        });
      })
      .catch(error => {
        console.log("NO DATA FETCHED", error);
      });
    clearInputs();
  };

  //@METHOD DELETE
  //Delete Specific Expense From Database.
  deleteExpense = expenseID => {
    axios
      .delete(`/expenses/${expenseID}`)
      .then(response => {
        this.setState({
          expenses: response.data
        });
      })
      .catch(error => {
        console.log("NO DATA FETCHED", error);
      });
  };

  componentDidMount() {
    let x = this.props.userData;
    if (!x) return;
    let b = x[0];
    this.setState(b);
  }

  //Store Input values In State
  handleChange = event => {
    this.setState({
      newExpense: {
        ...this.state.newExpense, // Copy The Entire Object In That State.
        [event.target.name]: event.target.value // Change Name And Value Depend On Input Change Status.
      }
    });
  };

  //Clear Input Fields After Adding New Expense.
  clearInputs = () => {
    this.setState({
      // Change Value Of Specific Keys in Key inside State.
      newExpense: {
        title: "",
        value: ""
      }
    });
  };

  handleAdd = event => {
    event.preventDefault();
    console.log("asdasd:", this.props);
    this.addExpenses(this.state.newExpense, this.clearInputs);
  };

  render() {
    console.log(this.props.userData);
    console.log("state", this.state);
    const { title, value } = this.state.newExpense;
    return (
      <div className="body">
        <Sidebar />
        <div className="user-info">
          <h2 className="user-name">
            {this.props.userData
              ? this.props.userData[0].name
              : this.props.history.push("/login")}
          </h2>
          <p className="balance">
            {this.props.userData
              ? `Current Balance: ${this.state.balance} ${this.props.userData[0].currency}`
              : ""}
          </p>
          <p className="balance">
            {this.props.userData
              ? `saving: ${this.state.saving} ${this.props.userData[0].currency}`
              : ""}
          </p>
        </div>

        <div className="add-salary">
          <button onClick={this.addSalaryHandler}> Salary deposite</button>
        </div>

        <div className="add-payment">
          <button type="button" data-toggle="modal" data-target="#exampleModal">
            {" "}
            <img src={require("../../Assets/cash.svg")} alt="" /> Add a Payment
          </button>
        </div>
        {this.state.expenses.length === 0 ? (
          <img
            className="empty"
            src={require("../../Assets/empty.svg")}
            alt=""
          />
        ) : (
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <td scope="col">Date</td>
                <td scope="col">Title</td>
                <td scope="col">Value</td>
                <td scope="col">Delete</td>
              </tr>
            </thead>
            <tbody>
              {this.state.expenses.map(element => (
                <Row
                  key={element._id}
                  expenses={element}
                  edit={this.updateExpenses}
                  remove={this.deleteExpense}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default Dashboard;
