import { connect } from "react-redux";
import RegistrationForm from "../components/RegistrationForm";
import { finishRegistration } from "../actions/RegistrationActions";

const mapStateToProps = null;

const mapDispatchToProps = (state) => ({
  onRegister: (user) => dispatch(finishRegistration(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);