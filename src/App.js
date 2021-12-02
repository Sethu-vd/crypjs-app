import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Layout, Tabs } from "antd";
import CryptoJS from "crypto-js";
import "antd/dist/antd.css";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

// [
//   { "name": "CSR QA", "value": "0fb1a0a622e86284948a568bccd0b1037f9428c9c519957f6fcab9d44e890280" },
//   { "name": "CSR Stage", "value": "0fb1a0a622e86284948a468bccd0b1037f9428c9c519957f6fcab9d44e890280" }
// ]

function App() {
  const { Option } = Select;
  const { Header } = Layout;
  const { TabPane } = Tabs;
  const [keys, setKeys] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem("keys")) ?? [];

    form.setFieldsValue({ keys: JSON.stringify(temp) });
    setKeys(temp);
  }, [form]);

  const onFinish = (values) => {
    const { data, hashKey, type } = values;

    if (type === "encrypt") {
      console.log("Encrypted");
      console.log(
        JSON.stringify({
          data: encryptData(hashKey, data),
        })
      );
    } else {
      console.log("Decrypted", decryptData(hashKey, JSON.parse(data)?.data));
    }
  };

  const onSaveLocalStorage = (values) => {
    const { keys } = values;
    localStorage.setItem("keys", JSON.stringify(JSON.parse(keys)));
    setKeys(JSON.parse(keys));
    console.log("Keys Saved");
  };
  function encryptData(hashKey, data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), hashKey).toString();
  }

  function decryptData(hashKey, data) {
    const bytes = CryptoJS.AES.decrypt(data, hashKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  return (
    <Layout>
      <Tabs defaultActiveKey="1" size={"large"} style={{ marginBottom: 32 }}>
        <TabPane
          tab={
            <Header style={{ backgroundColor: "grey" }}>
              Encrypt & Decrypt
            </Header>
          }
          key="1"
        >
          <Form {...layout} name="nest-messages" onFinish={onFinish}>
            <Form.Item name={["type"]} label="Type">
              <Select
                placeholder="Select a option and change input text above"
                allowClear
                defaultValue="decrypt"
                style={{ width: 120 }}
              >
                <Option value="decrypt">Decrypt</Option>
                <Option value="encrypt">Encrypt</Option>
              </Select>
            </Form.Item>
            <Form.Item name={["hashKey"]} label="Hash Key">
              <Select
                placeholder="Select a option and change input text above"
                allowClear
                style={{ width: 120 }}
              >
                {keys.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["data"]}
              label="Data"
              rules={[{ required: true }]}
            >
              <Input.TextArea autoSize={{ minRows: 10, maxRows: 16 }} />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane
          tab={
            <Header style={{ backgroundColor: "grey" }}>Add hashKeys</Header>
          }
          key="2"
        >
          <Form form={form} {...layout} onFinish={onSaveLocalStorage}>
            <Form.Item
              name={["keys"]}
              label="Keys JSON"
              rules={[{ required: true }]}
            >
              <Input.TextArea autoSize={{ minRows: 10, maxRows: 16 }} />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Layout>
  );
  // return <div className="App">App</div>;
}

export default App;
