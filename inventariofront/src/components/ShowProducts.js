import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
   Form,
   Table,
   Button,
   Container,
   Row,
   Col,
   Card,
   Badge,
   InputGroup,
   Navbar,
   Nav,
} from "react-bootstrap";
import {
   FaSearch,
   FaPlus,
   FaEdit,
   FaTrash,
   FaTag,
   FaBoxOpen,
   FaSignOutAlt,
} from "react-icons/fa";

const endpoint = "http://localhost:8000/api";

const ShowProducts = () => {
   const [products, setProducts] = useState([]);
   const [search, setSearch] = useState("");
   const [minPrice, setMinPrice] = useState("");
   const [maxPrice, setMaxPrice] = useState("");
   const [minStock, setMinStock] = useState("");
   const [maxStock, setMaxStock] = useState("");
   const [loading, setLoading] = useState(true);
   const [userEmail, setUserEmail] = useState("");

   const navigate = useNavigate();

   useEffect(() => {
      // Verificar si el usuario está autenticado
      const token = localStorage.getItem("auth_token");
      const email = localStorage.getItem("user_email");

      if (!token) {
         navigate("/");
         return;
      }

      setUserEmail(email || "usuario");
      getAllProducts();
   }, [navigate]);

   const getAllProducts = async () => {
      try {
         setLoading(true);
         const token = localStorage.getItem("auth_token");

         const response = await axios.get(`${endpoint}/products`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         setProducts(response.data);
         setLoading(false);
      } catch (error) {
         console.error("Error fetching products:", error);
         setLoading(false);

         // Si hay un error de autenticación (401), redirigir al login
         if (error.response && error.response.status === 401) {
            logout();
         }
      }
   };

   const logout = async () => {
      try {
         const token = localStorage.getItem("auth_token");

         if (token) {
            await axios.post(
               `${endpoint}/logout`,
               {},
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               }
            );
         }
      } catch (error) {
         console.error("Error al cerrar sesión:", error);
      } finally {
         // Siempre limpiar el localStorage y redirigir
         localStorage.removeItem("auth_token");
         localStorage.removeItem("user_email");
         navigate("/");
      }
   };

   const deleteProduct = async (id) => {
      if (
         window.confirm("¿Estás seguro de que deseas eliminar este producto?")
      ) {
         try {
            const token = localStorage.getItem("auth_token");

            await axios.delete(`${endpoint}/product/${id}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            getAllProducts();
         } catch (error) {
            console.error("Error deleting product:", error);

            if (error.response && error.response.status === 401) {
               logout();
            }
         }
      }
   };

   // Resto de tu código existente...
   const resetFilters = () => {
      setSearch("");
      setMinPrice("");
      setMaxPrice("");
      setMinStock("");
      setMaxStock("");
   };

   const filteredProducts = products.filter((product) => {
      return (
         product.name.toLowerCase().includes(search.toLowerCase()) &&
         (minPrice === "" || product.price >= parseFloat(minPrice)) &&
         (maxPrice === "" || product.price <= parseFloat(maxPrice)) &&
         (minStock === "" || product.stock >= parseInt(minStock)) &&
         (maxStock === "" || product.stock <= parseInt(maxStock))
      );
   });

   return (
      <>
         <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
            <Container>
               <Navbar.Brand>Sistema de Inventario</Navbar.Brand>
               <Navbar.Toggle aria-controls="basic-navbar-nav" />
               <Navbar.Collapse
                  id="basic-navbar-nav"
                  className="justify-content-end"
               >
                  <Nav>
                     <span className="nav-link text-light">
                        Bienvenido: {userEmail}
                     </span>
                     <Button variant="outline-danger" onClick={logout}>
                        <FaSignOutAlt className="me-2" />
                        Cerrar Sesión
                     </Button>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <Container fluid className="py-4 px-md-4">
            <Card className="shadow-sm border-0">
               <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                  <h2 className="m-0 fs-4">Gestión de Inventario</h2>
                  <div>
                     <Link to="/create" className="btn btn-success">
                        <FaPlus className="me-2" /> Crear Producto
                     </Link>
                     <Link to="/inventory" className="btn btn-info ms-2">
                        <FaBoxOpen className="me-2" /> Gestionar Inventario
                     </Link>
                  </div>
               </Card.Header>

               {/* El resto de tu código existente... */}
               <Card.Body>
                  <div className="mb-4 p-3 bg-light rounded">
                     <Row className="g-3">
                        <Col md={12}>
                           <InputGroup>
                              <InputGroup.Text>
                                 <FaSearch />
                              </InputGroup.Text>
                              <Form.Control
                                 type="text"
                                 placeholder="Buscar por nombre..."
                                 value={search}
                                 onChange={(e) => setSearch(e.target.value)}
                              />
                           </InputGroup>
                        </Col>

                        <Col md={3}>
                           <InputGroup>
                              <InputGroup.Text>
                                 <FaTag />
                              </InputGroup.Text>
                              <Form.Control
                                 type="number"
                                 placeholder="Precio Mínimo"
                                 value={minPrice}
                                 onChange={(e) => setMinPrice(e.target.value)}
                              />
                           </InputGroup>
                        </Col>

                        <Col md={3}>
                           <InputGroup>
                              <InputGroup.Text>
                                 <FaTag />
                              </InputGroup.Text>
                              <Form.Control
                                 type="number"
                                 placeholder="Precio Máximo"
                                 value={maxPrice}
                                 onChange={(e) => setMaxPrice(e.target.value)}
                              />
                           </InputGroup>
                        </Col>

                        <Col md={3}>
                           <InputGroup>
                              <InputGroup.Text>
                                 <FaBoxOpen />
                              </InputGroup.Text>
                              <Form.Control
                                 type="number"
                                 placeholder="Stock Mínimo"
                                 value={minStock}
                                 onChange={(e) => setMinStock(e.target.value)}
                              />
                           </InputGroup>
                        </Col>

                        <Col md={3}>
                           <InputGroup>
                              <InputGroup.Text>
                                 <FaBoxOpen />
                              </InputGroup.Text>
                              <Form.Control
                                 type="number"
                                 placeholder="Stock Máximo"
                                 value={maxStock}
                                 onChange={(e) => setMaxStock(e.target.value)}
                              />
                           </InputGroup>
                        </Col>

                        <Col className="d-flex justify-content-end">
                           <Button
                              variant="secondary"
                              onClick={resetFilters}
                              className="px-4"
                           >
                              Limpiar Filtros
                           </Button>
                        </Col>
                     </Row>
                  </div>

                  {loading ? (
                     <div className="text-center py-5">
                        <div
                           className="spinner-border text-primary"
                           role="status"
                        >
                           <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando productos...</p>
                     </div>
                  ) : filteredProducts.length === 0 ? (
                     <div className="text-center py-5">
                        <p className="mb-0">
                           No se encontraron productos que coincidan con los
                           filtros.
                        </p>
                     </div>
                  ) : (
                     <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                           <thead className="bg-light">
                              <tr>
                                 <th>Nombre</th>
                                 <th>Descripción</th>
                                 <th>Precio</th>
                                 <th>Existencias</th>
                                 <th className="text-center">Acciones</th>
                              </tr>
                           </thead>
                           <tbody>
                              {filteredProducts.map((product) => (
                                 <tr key={product.id}>
                                    <td className="fw-bold">{product.name}</td>
                                    <td>
                                       {product.description.length > 100
                                          ? `${product.description.substring(
                                               0,
                                               100
                                            )}...`
                                          : product.description}
                                    </td>
                                    <td>
                                       <Badge
                                          bg="info"
                                          className="py-2 px-3 fs-6"
                                       >
                                          ${product.price.toFixed(2)}
                                       </Badge>
                                    </td>
                                    <td>
                                       <Badge
                                          bg={
                                             product.stock > 10
                                                ? "success"
                                                : product.stock > 5
                                                ? "warning"
                                                : "danger"
                                          }
                                          className="py-2 px-3 fs-6"
                                       >
                                          {product.stock}
                                       </Badge>
                                    </td>
                                    <td>
                                       <div className="d-flex justify-content-center gap-2">
                                          <Link
                                             to={`/edit/${product.id}`}
                                             className="btn btn-warning"
                                          >
                                             <FaEdit />{" "}
                                             <span className="d-none d-md-inline ms-1">
                                                Editar
                                             </span>
                                          </Link>
                                          <Button
                                             variant="danger"
                                             onClick={() =>
                                                deleteProduct(product.id)
                                             }
                                          >
                                             <FaTrash />{" "}
                                             <span className="d-none d-md-inline ms-1">
                                                Eliminar
                                             </span>
                                          </Button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </Table>
                     </div>
                  )}
               </Card.Body>

               <Card.Footer className="bg-white border-top">
                  <div className="d-flex justify-content-between align-items-center">
                     <p className="text-muted mb-0">
                        Total: {filteredProducts.length} productos
                     </p>
                     <div>
                        <small className="text-muted">
                           Gestión Productos - Inventario
                        </small>
                     </div>
                  </div>
               </Card.Footer>
            </Card>
         </Container>
      </>
   );
};

export default ShowProducts;
