import {
  Card,
  Input,
  Spin,
  Tag,
  Drawer,
  List,
  Button,
  Space,
  Tooltip,
  Modal,
  message,
  Select,
} from "antd";
import { EditOutlined, PhoneOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  DUPLICATE_OLD_USERS_BY_UID,
  OLD_USERS,
  OLD_USERS_BY_UID,
  PANEL_UPDATE_OLD_USERS_MOBILE,
  PANEL_UPDATE_OLD_USERS_STATUS,
  RELATION_OLD_USERS_BY_UID,
} from "../../api";
import SGSTable from "../../components/STTable/STTable";
import { useApiMutation } from "../../hooks/useApiMutation";
import HighlightText from "../../components/common/HighlightText";

const { Search } = Input;

const OldUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger: GetOldUser, loading: isMutating } = useApiMutation();
  const { trigger: GetOldUserByUid, loading: drawerLoading } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50"],
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState([]);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerLabels, setDrawerLabels] = useState({});
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [selectedUserForPhone, setSelectedUserForPhone] = useState(null);
  const [newMobile, setNewMobile] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedUserForStatus, setSelectedUserForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  const { trigger: UpdateMobile, loading: isUpdatingMobile } = useApiMutation();
  const { trigger: UpdateStatus, loading: isUpdatingStatus } = useApiMutation();

  const handleEdit = (record) => {
    setSelectedUserForStatus(record);
    setNewStatus(null);
    setStatusModalOpen(true);
  };

  const handleAddPhone = (record) => {
    const mobile = record.user_new_mobile || "";
    setSelectedUserForPhone(record);
    setNewMobile(mobile);
    setPhoneModalOpen(true);
  };

  const handlePhoneUpdate = async () => {
    if (newMobile.length !== 0 && newMobile.length !== 10) {
      message.error(
        "Please enter a valid 10-digit mobile number or leave it empty",
      );
      return;
    }

    try {
      const res = await UpdateMobile({
        url: `${PANEL_UPDATE_OLD_USERS_MOBILE}/${selectedUserForPhone.id}`,
        method: "PUT",
        data: { user_new_mobile: newMobile || null },
      });

      if (res.code === 201) {
        message.success(res.message || "Mobile number updated successfully");
        setPhoneModalOpen(false);
        fetchUser(); // Refresh the list
      } else {
        message.error(res.message || "Failed to update mobile number");
      }
    } catch (error) {
      console.error("Error updating mobile number:", error);
      message.error("An error occurred while updating the mobile number");
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      message.error("Please select a status");
      return;
    }

    try {
      const res = await UpdateStatus({
        url: `${PANEL_UPDATE_OLD_USERS_STATUS}/${selectedUserForStatus.id}`,
        method: "PUT",
        data: { user_new_status: newStatus },
      });

      if (res.code === 201) {
        message.success(res.message || "Status updated successfully");
        setStatusModalOpen(false);
        fetchUser(); // Refresh the list
      } else {
        message.error(res.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("An error occurred while updating the status");
    }
  };
  const fetchUser = async () => {
    const res = await GetOldUser({ url: OLD_USERS });
    if (Array.isArray(res.data)) {
      setUsers(res.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleFlagClick = async (record) => {
    setDrawerOpen(true);

    let url = "";
    let title = "";
    let clickedIdLocal = "";

    if (record.duplicate_flag && record.duplicate_flag.trim() !== "") {
      url = `${DUPLICATE_OLD_USERS_BY_UID}/${record.uid}`;
      title = "Duplicate Users";
      clickedIdLocal = record.uid;
    } else if (record.flag == "R") {
      url = `${RELATION_OLD_USERS_BY_UID}/${record.related_uid}`;
      title = "Relation Users";
      clickedIdLocal = record.related_uid;
    } else if (record.flag == "F") {
      url = `${OLD_USERS_BY_UID}/${record.uid}`;
      title = "Old Users";
    }

    try {
      const res = await GetOldUserByUid({ url });
      if (Array.isArray(res.data)) {
        setDrawerData(res.data);
        const labels = {};
        res.data.forEach((item) => {
          if (title == "Duplicate Users") {
            labels[item.uid] =
              item.uid == clickedIdLocal
                ? { labelText: "Original", labelColor: "#b7f0a7" }
                : { labelText: "Duplicate", labelColor: "#f7a7a7" };
          } else if (title == "Relation Users") {
            labels[item.uid] =
              item.uid == clickedIdLocal
                ? { labelText: "Original", labelColor: "#b7f0a7" }
                : { labelText: "Relation", labelColor: "#f7a7a7" };
          } else {
            labels[item.uid] = { labelText: "", labelColor: "#fff7f7" };
          }
        });
        setDrawerLabels(labels);
      } else {
        setDrawerData([]);
        setDrawerLabels({});
      }
    } catch (error) {
      console.error("Error fetching drawer data:", error);
      setDrawerData([]);
      setDrawerLabels({});
    } finally {
      setDrawerTitle(title);
      // setClickedId(clickedIdLocal);
    }
  };

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
      render: (_, user) => (
        <HighlightText text={user.uid} match={user._match} />
      ),
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      render: (_, user) => (
        <HighlightText text={user.full_name} match={user._match} />
      ),
    },
    {
      title: "Address",
      key: "address",
      render: (_, user) => (
        <div
          style={{
            maxWidth: 200,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          <HighlightText
            text={user.related_address || user.address || "-"}
            match={user._match}
          />
        </div>
      ),
    },
    {
      title: "Mobile",
      key: "mobile",
      render: (_, user) => (
        <HighlightText
          text={user.related_mobile || user.mobile || "-"}
          match={user._match}
        />
      ),
    },
    {
      title: "New Mobile",
      key: "user_new_mobile",
      render: (_, user) => (
        <HighlightText text={user.user_new_mobile || "-"} match={user._match} />
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, user) => (
        <HighlightText
          text={user.related_email || user.email || "-"}
          match={user._match}
        />
      ),
    },
    {
      title: "Flag",
      key: "flag",
      render: (_, record) => (
        <Tag
          color={
            record.duplicate_flag && record.duplicate_flag.trim() !== ""
              ? "red"
              : record.flag === "R"
                ? "orange"
                : "default"
          }
          className="cursor-pointer"
          onClick={() => handleFlagClick(record)}
        >
          {record.duplicate_flag && record.duplicate_flag.trim() !== ""
            ? "Duplicate"
            : record.flag}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Status">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Add Phone Number">
            <Button
              type="default"
              shape="circle"
              icon={<PhoneOutlined />}
              onClick={() => handleAddPhone(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredUsers = users
    .map((user) => {
      const flatString = Object.values(user)
        .filter((v) => typeof v === "string" || typeof v === "number")
        .join(" ")
        .toLowerCase();
      const matched = flatString.includes(searchTerm.toLowerCase());
      return matched ? { ...user, _match: searchTerm } : null;
    })
    .filter(Boolean);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold heading">Old Users List</h2>
        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search Users"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white-100 border border-white-100 shadow-2xl" />
              <span className="text-sm text-gray-700">Single</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300" />
              <span className="text-sm text-gray-700">Relation</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
              <span className="text-sm text-gray-700">Duplicate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <SGSTable
            data={filteredUsers}
            columns={columns}
            pagination={pagination}
            onChange={(pag) => setPagination(pag)}
            rowClassName={(record) => {
              if (
                record.duplicate_flag &&
                record.duplicate_flag.trim() !== ""
              ) {
                return "bg-red-100";
              }
              if (record.flag === "R") {
                return "bg-orange-100";
              }
              return "";
            }}
          />
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
      <Drawer
        title={drawerTitle}
        placement="right"
        width={400}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {drawerLoading ? (
          <Spin size="large" className="w-full flex justify-center py-10" />
        ) : drawerData.length > 0 ? (
          <List
            dataSource={drawerData}
            renderItem={(item) => {
              const { labelText, labelColor } = drawerLabels[item.uid] || {};

              return (
                <List.Item key={item.uid}>
                  <Card
                    size="small"
                    className="w-full shadow-lg border border-gray-200 rounded-lg relative overflow-hidden"
                  >
                    {labelText && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          textAlign: "center",
                          backgroundColor: labelColor,
                          color: "#000",
                          fontWeight: 600,
                          padding: "2px 0",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        {labelText}
                      </div>
                    )}

                    <div className="flex flex-col gap-3 mt-6">
                      <div className="flex items-center">
                        <span className="w-28 font-bold">UID:</span>
                        <span className="text-gray-900">{item.uid || "-"}</span>
                      </div>

                      <div className="flex items-center">
                        <span className="w-28 font-bold">Name:</span>
                        <span className="text-gray-900">
                          {item.full_name || item.name || "-"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-28 font-bold">Mobile:</span>
                        <span className="text-gray-900">
                          {item.mobile || "-"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-28 font-bold">Email:</span>
                        <span className="text-gray-900">
                          {item.email || "-"}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-28 font-bold">Address:</span>
                        <span className="text-gray-900 break-words">
                          {item.address || "-"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        ) : (
          <div className="text-center text-gray-500 py-10">No data found</div>
        )}
      </Drawer>

      <Modal
        title="Update New Mobile Number"
        open={phoneModalOpen}
        onOk={handlePhoneUpdate}
        onCancel={() => setPhoneModalOpen(false)}
        confirmLoading={isUpdatingMobile}
        okButtonProps={{
          disabled: newMobile === selectedUserForPhone?.user_new_mobile,
        }}
      >
        <div className="flex flex-col gap-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <Input
              placeholder="Enter 10-digit mobile number"
              value={newMobile}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                if (val.length <= 10) {
                  setNewMobile(val);
                }
              }}
              maxLength={10}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Update User Status"
        open={statusModalOpen}
        onOk={handleStatusUpdate}
        onCancel={() => setStatusModalOpen(false)}
        confirmLoading={isUpdatingStatus}
        okButtonProps={{
          disabled: !newStatus,
        }}
      >
        <div className="flex flex-col gap-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Status
            </label>
            <Select
              className="w-full"
              placeholder="Select Status"
              value={newStatus}
              onChange={(value) => setNewStatus(value)}
            >
              <Select.Option value="Expired">Expired</Select.Option>
              <Select.Option value="Shifted">Shifted</Select.Option>
            </Select>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default OldUsers;
