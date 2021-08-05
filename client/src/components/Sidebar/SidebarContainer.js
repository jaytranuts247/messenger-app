import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Sidebar } from "./index";
import { searchUsers } from "../../store/utils/thunkCreators";
import { clearSearchedUsers } from "../../store/conversations";

const SidebarContainer = (props) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    if (event.target.value === "") {
      // clear searched convos from redux store
      dispatch(clearSearchedUsers());
      setSearchTerm("");
      return;
    }
    if (searchTerm.includes(event.target.value)) {
      // if new value is included in search term, we don't need to make another API call, just need to set the search term value so the conversations can be filtered in the rendering
      setSearchTerm(event.target.value);
      return;
    }
    dispatch(searchUsers(event.target.value));
    setSearchTerm(event.target.value);
  };

  return <Sidebar handleChange={handleChange} searchTerm={searchTerm} />;
};

export default SidebarContainer;
