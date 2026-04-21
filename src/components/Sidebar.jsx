import {
  ArrowRightOutlined,
  CarOutlined,
  CloseOutlined,
  HomeOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  SolutionOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Menu } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setShowUpdateDialog } from "../store/auth/versionSlice";
import useFinalUserImage from "./common/Logo";

const getMenuItems = (collapsed, userTypeRaw) => {
  const uType = Number(userTypeRaw);
  const isOnlyuser = uType === 1;

  if (isOnlyuser) {
    const dashboardItems = [
      { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
      { key: "/profile", icon: <UserOutlined />, label: "Profile" },
    ];

    if (collapsed) {
      return dashboardItems;
    }

    return [{ type: "group", label: "Dashboard", children: dashboardItems }];
  }

  const dashboardItems = [
    { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
  ];
  const olddUserItems = [
    { key: "/old-users", icon: <TeamOutlined />, label: "Old Users" },
    { key: "/new-users", icon: <UsergroupAddOutlined />, label: "New Users" },
    {
      key: "/shifted-died-users",
      icon: <UsergroupDeleteOutlined />,
      label: "Shifted/Died Users",
    },
  ];

  const memberItems = [
    { key: "/life-member", icon: <LockOutlined />, label: "Life Membership" },
  ];

  //  const managementChildren = [
  //     { key: "/life-member", icon: <LockOutlined />, label: "Life Membership" },
  //     {
  //       key: "/patron",
  //       icon: <SolutionOutlined />,
  //       label: "Patron",
  //     },
  //     { key: "/dy-patron", icon: <CarOutlined />, label: "Dy Patron" },
  //   ];
  const midIssued =
    uType === 3
      ? [{ key: "/mid-issued", icon: <IdcardOutlined />, label: "MID Issued" }]
      : [];

  if (collapsed) {
    return [
      ...dashboardItems,
      ...olddUserItems,
      // {
      //   key: "sub",
      //   icon: <MailOutlined />,
      //   label: "Management",
      //   children: managementChildren,
      // },
      ...midIssued,
    ];
  }

  return [
    { type: "group", label: "Dashboard", children: dashboardItems },
    { type: "group", label: "Users", children: olddUserItems },

    {
      type: "group",
      label: "Member",
      children: [
        // {
        //   key: "sub",
        //   icon: <MailOutlined />,
        //   label: "Member",
        //   children: managementChildren,
        // },
        ...memberItems,
      ],
    },
    midIssued.length > 0
      ? { type: "group", label: "MID", children: midIssued }
      : null,
  ].filter(Boolean);
};

export default function Sidebar({ collapsed, isMobile = false, onClose }) {
  const location = useLocation();
  const selectedKeys = [location.pathname];
  const getOpenKeysFromPath = (path) => {
    if (path.startsWith("/report-")) return ["sub2"];
    return [];
  };
  const userType = useSelector((state) => state.auth?.user?.user_type);
  const [openKeys, setOpenKeys] = useState(() =>
    getOpenKeysFromPath(location.pathname),
  );
  const naviagte = useNavigate();
  const items = getMenuItems(collapsed, Number(userType));
  const dispatch = useDispatch();
  const finalUserImage = useFinalUserImage();
  const userCompany = useSelector((state) => state?.company?.companyDetails);
  const [delayedCollapse, setDelayedCollapse] = useState(collapsed);
  const localVersion = useSelector((state) => state.auth?.version);
  const serverVersion = useSelector((state) => state?.version?.version);
  const showDialog = localVersion !== serverVersion ? true : false;
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedCollapse(collapsed);
    }, 150);

    return () => clearTimeout(timeout);
  }, [collapsed]);

  const handleOpenDialog = () => {
    dispatch(
      setShowUpdateDialog({
        showUpdateDialog: true,
        version: serverVersion,
      }),
    );
  };
  const rootSubmenuKeys = ["sub", "sub1", "sub2"];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (collapsed) {
        setOpenKeys([]);
      } else {
        setOpenKeys(rootSubmenuKeys);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [collapsed]);

  return (
    <motion.aside
      initial={{ width: collapsed ? 95 : 260 }}
      animate={{ width: collapsed ? 95 : 260 }}
      transition={{ duration: 0.3 }}
      className={`h-full bg-white shadow-xl  overflow-hidden flex flex-col font-[Inter] transition-all duration-300
        ${isMobile ? "fixed z-50 h-screen" : "relative"}`}
    >
      <div className="flex items-center justify-center h-14 px-4 !bg-[#ffe1f4] border-b border-b-[#993873]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-start gap-2 w-full"
        >
          <img
            src={finalUserImage || ""}
            alt="Logo"
            className={`object-contain transition-all duration-300 ${
              collapsed ? "w-10 mx-auto" : "w-10"
            }`}
          />

          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[#993873] font-semibold text-[18px]"
            >
              {userCompany.company_name || "Shri Bangalore Vaishnav Samaj"}
            </motion.span>
          )}
        </motion.div>

        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-[#993873] hover:text-red-400 transition-colors"
          >
            <CloseOutlined className="text-xl" />
          </motion.button>
        )}
      </div>

      <div className="flex-1  py-2 scrollbar-custom">
        <Menu
          mode="inline"
          inlineCollapsed={delayedCollapse}
          items={items}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={(keys) => {
            if (!collapsed) return;
            setOpenKeys(keys);
          }}
          onClick={({ key, keyPath }) => {
            if (isMobile && onClose) {
              onClose();
            }

            // Only close dropdowns when collapsed
            if (collapsed && keyPath.length === 1) {
              setOpenKeys([]);
            }

            naviagte(key);
          }}
          className="custom-menu"
        />
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-500 text-center border-t border-[#993873] bg-white"
        >
          {showDialog ? (
            <div
              className="w-full cursor-pointer animate-pulse"
              onClick={handleOpenDialog}
            >
              <Alert
                message={
                  <div className="flex items-center justify-center text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      New Updated: V{localVersion}
                      <ArrowRightOutlined />V{serverVersion}
                    </span>
                  </div>
                }
                type="warning"
                banner
                showIcon={false}
                className="rounded-md !bg-[#ffe1f4] !text-[#993873] !border-[#993873] px-4 py-1"
              />
            </div>
          ) : (
            <Alert
              message={
                <div className="flex flex-col items-center text-center text-xs font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1">
                      Version: {localVersion}
                    </span>
                  </div>
                  <div className="text-[11px] font-normal text-gray-500 mt-1">
                    Updated on: 21-04-2026
                  </div>
                </div>
              }
              type="info"
              banner
              showIcon={false}
              className="rounded-md !bg-[#ffe1f4] !text-[#993873] !border-[#993873] px-4 py-1"
            />
          )}
        </motion.div>
      )}
    </motion.aside>
  );
}
