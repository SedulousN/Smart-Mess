import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard">Hostel Portal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        {isLoggedIn && (
                            <>
                                <Nav.Link as={Link} to="/dashboard/profile">Profile</Nav.Link>
                                {/* <Nav.Link as={Link} to="/dashboard/meal-calendar">Meal Calendar</Nav.Link> */}
                                <Nav.Link as={Link} to="/dashboard/meal-history">Meal History</Nav.Link>
                                <Nav.Link as={Link} to="/dashboard/mess-menu">Mess Menu</Nav.Link>
                                <Nav.Link as={Link} to="/dashboard/notices">Notices</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        )}
                        {!isLoggedIn && (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
