import React from 'react'
import { Link } from 'react-router-dom';
import { Breadcrumb } from "antd";
import './styles/MainBreadcrumb.css';

interface Item {
    text: string;
    link: string;
    link_type: string;
}

interface Props {
    items: Item[];
  }

  export const MainBreadcrumb: React.FC<Props> = ({items}: Props) => {
    return (
        <Breadcrumb>
        {
          items.map(({text, link, link_type}, index) => {
            return (
              <Breadcrumb.Item key={`breadcrumbItem-${index}`}>
                { link_type === "linkto" ? (
                  <Link to={link}>{text}</Link>
                ) :
                  <a href={link}>{text}</a>
                }
              </Breadcrumb.Item>
            )
          })
        }
    </Breadcrumb>
    )
}

export default MainBreadcrumb
