import { FaRegMap } from "react-icons/fa";
import { IoNavigateCircleOutline } from "react-icons/io5";
import { FaPeopleRoof } from "react-icons/fa6";
import { RiLoginCircleLine } from "react-icons/ri";
//


import { AiFillGithub } from "react-icons/ai";
import { AiOutlineCodepen } from "react-icons/ai";
import { AiFillYoutube } from "react-icons/ai";
import { AiOutlineInstagram } from "react-icons/ai";

export const headerMenus = [
    {
        title: "로그인",
        icon: <RiLoginCircleLine />,
        src: "/login"
    },
    {
        title: "지도",
        icon: <FaRegMap />,
        src: "/map"
    },
    {
        title: "실시간 길찾기",
        icon: <IoNavigateCircleOutline />,
        src: "/nav"
    },
    
    {
        title: "노선별 실시간 혼잡도",
        icon: <FaPeopleRoof />,
        src: "/developer"
    },
    
    
    
   
];

export const searchKeyword = [
    {
        title: "TS팀 소개",
        src: "/tsteam"
    },
    
];

export const snsLink = [
    {
        title: "github",
        url: "https://github.com/webstoryboy",
        icon: <AiFillGithub />
    },
    {
        title: "youtube",
        url: "https://www.youtube.com/webstoryboy",
        icon: <AiFillYoutube />
    },
    {
        title: "codepen",
        url: "https://codepen.io/webstoryboy",
        icon: <AiOutlineCodepen />
    },
    {
        title: "instagram",
        url: "https://www.instagram.com/webstoryboy",
        icon: <AiOutlineInstagram />
    },
]