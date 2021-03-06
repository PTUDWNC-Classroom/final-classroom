import { Grid, Typography } from "@mui/material"
import React, { useState, useEffect, useContext } from "react"

import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import CircularProgress from "@mui/material/CircularProgress"

import classroomAxios from "../../Components/DataConnection/axiosConfig"
import ClassItem from "../../Components/Class/ClassItem"
import { ClassroomContext } from "../../context/ClassroomContext"

const ClassList = () => {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { classList, updateClassList } = useContext(ClassroomContext)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    const getClassList = async () => {
      try {
        const response = await classroomAxios.get(`classes/class-list`)

        if (response) {
          setIsLoaded(true)
          updateClassList(response.data)
        }
      } catch (error) {
        //console.log("lỗi get classlist")
        //console.error(error)
        setIsLoaded(true)
        setError(error)
      }
    }

    getClassList()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    document.title = "Classroom"
  }, [])

  if (error) {
    return (
      <Typography variant="h4" color="error" align="center" flexGrow={1}>
        Error: {error.message}
      </Typography>
    )
  } else if (!isLoaded) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "90vh" }}
      >
        <Grid item xs={3}>
          <CircularProgress />
        </Grid>
      </Grid>
    )
  } else {
    return (
      <Grid container spacing={3}>
        {classList.length > 0 ? (
          classList.map((item) => (
            <ClassItem
              key={item._id}
              id={item._id}
              className={item.className}
              section={item.section}
              handleClick={handleClick}
            />
          ))
        ) : (
          <Typography variant="h4" color="error" align="center" flexGrow={1}>
            Class not found!
          </Typography>
        )}

        <Menu
          id="menu-class-setting"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Change background</MenuItem>
          <MenuItem onClick={handleClose}>Delete</MenuItem>
        </Menu>
      </Grid>
    )
  }
}

export default ClassList
