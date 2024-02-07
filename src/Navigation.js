import * as React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

function CustomTabPanel({ children }) {
  return (
    <div role="tabpanel">
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    </div>
  );
}

const Navigation = () => {
  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <CustomTabPanel>
        <Link style={{ textDecoration: "none" }} to="../crypto">
          Crypto
        </Link>
      </CustomTabPanel>

      <CustomTabPanel>
        <Link style={{ textDecoration: "none" }} to="../forex">
          Forex
        </Link>
      </CustomTabPanel>
    </Box>
  );
};

export default Navigation;
