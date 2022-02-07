import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { Link } from "react-router-dom";
import { SiderProps } from "./props";
import { CollapseProps } from "./props/collapseProps";
import {
  HomeOutlined,
  ProfileOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import { ArchiveSvg } from "../../utils/Svg";

import { MenuOutlined } from "@ant-design/icons";
import "./styles/MainSider.css";

const { Sider } = Layout;

interface Props {
  activeKey: string | undefined;
}

export const MainSider: React.FC<Props> = ({ activeKey }: Props) => {
  const [collapsed, setCollapsed] = useState(CollapseProps);
  const [toolTip, setToolTip] = useState(true);

  const handleClick = () => {
    if (collapsed == CollapseProps) {
      setCollapsed(SiderProps);
      setToolTip(false);
    } else if (collapsed == SiderProps) {
      setCollapsed(CollapseProps);
      setToolTip(true);
    }
  };

  return (
    <Sider {...(collapsed as object)}>
      <Button
        title={toolTip ? "click to expand menu" : "click to collapse menu"}
        onClick={handleClick}
        className='collapseButton'
      >
        <MenuOutlined />
      </Button>
      <Menu defaultSelectedKeys={[`${activeKey}`]} mode='inline'>
        <Menu.Item key='home' icon={<HomeOutlined />}>
          <Link title={toolTip ? "Home" : ""} to={`/home`}>
            {" "}
            Home
          </Link>
        </Menu.Item>

        <Menu.Item key='application' icon={<ProfileOutlined />}>
          <Link title={toolTip ? "New Application" : ""} to={`/application`}>
            {" "}
            New Application
          </Link>
        </Menu.Item>

        <Menu.Item key='saved-calculators' icon={<CalculatorOutlined />}>
          <Link
            title={toolTip ? "Saved Calculators" : ""}
            to={`/saved-calculators`}
          >
            {" "}
            Saved Calculators
          </Link>
        </Menu.Item>

        <Menu.Item key='archived-applications' icon={<ArchiveSvg />}>
          <Link
            title={toolTip ? "Archived" : ""}
            className='lastMenu'
            to={`/archived-applications`}
          >
            {" "}
            Archived
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};
