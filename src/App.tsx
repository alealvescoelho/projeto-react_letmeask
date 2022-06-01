import { Route, BrowserRouter, Routes  } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AuthContextProvider } from "./context/AuthContext";
import { AdminRoom } from "./pages/AdminRoom";
import { ListRoom } from "./pages/ListRoom";

/* nota:

  O "component" e o "exact" não foram aceitos nessa versão do 'react-router-dom',
  foi necessário utilizar além de Route, o Routes, onde cada Route está dentro.

  Sendo assim, não é mais necessário o "exact".

  Além disso, no lugar de "component", entra o "element":

  ANTES: <Route path="/" exect component={Home} />
  AGORA: <Route path="/" element={<Home />} />

*/

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/list" element={<ListRoom />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/admin/rooms/:id" element={<AdminRoom />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
