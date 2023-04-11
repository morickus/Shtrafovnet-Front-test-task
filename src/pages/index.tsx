import React, { useEffect, useState } from 'react'
import { Form, Button, Table, Modal, Collapse, Input, InputNumber, Switch } from 'antd'
import { CopyOutlined, MinusOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons'
import CopyToClipboard from '@/helpers/CopyToClipboard'
import type { ColumnsType } from 'antd/es/table'
import styles from '@/styles/Home.module.css'
import { DataType, ICustomer } from '@/types'
import { createServer } from "miragejs"
import data from '../../customers.json'
import Head from 'next/head'
import dayjs from 'dayjs'

const { Panel } = Collapse

createServer({
  routes() {
    this.get('/api/v1/customers', () => data)
    this.post("/api/v1/customers", (schema, request) => {
      let body = JSON.parse(request.requestBody)
      return { err: null, body }
    })
  }
})

const columns = [
  {
    title: 'Имя',
    dataIndex: 'name',
  },
  {
    title: 'ID',
    dataIndex: 'id',
    render: (id: string) => <>{id} <CopyOutlined onClick={() => CopyToClipboard(id)} /></>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Отсрочка оплаты',
    dataIndex: 'deferral_days',
    render: (text: string) => <>{text} дней</>,
  },
  {
    title: 'Создан',
    dataIndex: 'created_at',
    render: (date: string) => <>{dayjs(date).format('DD.MM.YYYY')}</>,
  },
  {
    title: 'Изменен',
    dataIndex: 'updated_at',
    render: (date: string) => <>{dayjs(date).format('DD.MM.YYYY')}</>,
  }
] as ColumnsType<DataType>

export default function Home() {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [isModalCreate, setIsModalCreate] = useState(false)
  const bankAccountsValue = Form.useWatch('bank_accounts', form)

  useEffect(() => {
    fetch('/api/v1/customers')
      .then(r => r.json())
      .then(customers => setCustomers(customers))
  }, [])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const closeModal = () => {
    form.resetFields()
    setIsModalCreate(false)
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Клиенты</h1><Button type="primary" onClick={() => setIsModalCreate(true)}>Добавить клиента</Button>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={customers} />
      </main>
      <Modal
        title="Создание цены"
        open={isModalCreate}
        onCancel={closeModal}
        footer={<Button type="primary" onClick={() => form.submit()}>Создать</Button>}
      >
        <Form form={form} initialValues={{bank_accounts: [{ is_default: true }], invoice_emails: [undefined]}} onFinish={v => {
          fetch('/api/v1/customers', { method: 'POST', body: JSON.stringify(v) })
            .then(r => r.json())
            .then(r => {
              if (r.err == null) {
                setCustomers(prev => [{
                  ...r.body
                }, ...prev])
                closeModal()
              }
            })
        }}>
          <Collapse defaultActiveKey={['1','2','3','4','5']} ghost>
            <Panel header="Детали Клиента" key="1">
              <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите Имя' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите Email' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="deferral_days" label="Дней отсрочки" rules={[{ required: true, message: 'Дней отсрочки должна быть больше или равна нулю' }]}>
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name="balance.credit_limit" label="Кридитный лимит" rules={[{ required: true, message: 'Кридитный лимит должен быть больше или равен нулю' }]}>
                <InputNumber min={0} />
              </Form.Item>
            </Panel>
            <Panel header="Детали Организации" key="2">
              <Form.Item name="org.name" label="Название организации" rules={[{ required: true, message: 'Введите Название организации' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="org.inn" label="ИНН организации" rules={[{ required: true, message: 'Введите ИНН организации' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="org.kpp" label="КПП организации" rules={[{ required: true, message: 'Введите КПП организации' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="org.ogrn" label="ОГРН организации" rules={[{ required: true, message: 'Введите ОГРН организации' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="org.addr" label="Юридический адрес" rules={[{ required: true, message: 'Введите Юридический адрес' }]}>
                <Input />
              </Form.Item>
            </Panel>
            <Panel header="Банковские счета" key="3">
              <Form.List name="bank_accounts">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key}>
                        <Form.Item
                          key={`${field.key}-name`}
                          name={[field.name, 'name']}
                          label="Название счета"
                          rules={[{ required: true, message: 'Введите название счета' }]}
                        >
                          <Input placeholder="Название счета" />
                        </Form.Item>
                        <Form.Item
                          key={`${field.key}-account_number`}
                          name={[field.name, 'account_number']}
                          label="Номер счета"
                          rules={[{ required: true, message: 'Введите номер счета' }]}
                        >
                          <Input placeholder="Номер счета" />
                        </Form.Item>
                        <Form.Item
                          key={`${field.key}-bik`}
                          name={[field.name, 'bik']}
                          label="БИК счета"
                          rules={[{ required: true, message: 'Введите БИК счета' }]}
                        >
                          <Input placeholder="БИК счета" />
                        </Form.Item>
                        <Form.Item
                          key={`${field.key}-corr_account_number`}
                          name={[field.name, 'corr_account_number']}
                          label="Корр. номер счета"
                          rules={[{ required: true, message: 'Введите Корр. номер счета' }]}
                        >
                          <Input placeholder="Корр. номер счета" />
                        </Form.Item>
                        <Form.Item
                          key={`${field.key}-is_default`}
                          name={[field.name, 'is_default']}
                          label="Дефолтный счет"
                          valuePropName="checked"
                        >
                          <Switch
                            disabled={bankAccountsValue && bankAccountsValue[index]?.is_default}
                            onChange={() => form.setFieldValue('bank_accounts', bankAccountsValue.map((i, indexF) => ({...i, is_default: indexF == index})))}
                          />
                        </Form.Item>
                        {index > 0 && <Button danger onClick={() => {
                          if (bankAccountsValue[index]?.is_default) {
                            form.setFieldValue('bank_accounts', bankAccountsValue.map((i, indexF) => ({...i, is_default: indexF == 0})))
                          }
                          remove(field.name)
                        }}><MinusOutlined /> Удалить счет</Button>}
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Добавить ещё счет
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Panel>
            <Panel header="Emails для счетов" key="4">
              <Form.List name="invoice_emails">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key}>
                        <Form.Item
                          key={`${field.key}-email`}
                          name={[field.name, 'email']}
                          label="Email"
                          rules={[{ required: true, message: 'Введите Email' }]}
                        >
                          <Input placeholder="Email" />
                        </Form.Item>
                        {index > 0 && <Button danger onClick={() => remove(field.name)}><MinusOutlined /> Удалить email</Button>}
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Добавить ещё email
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Panel>
            <Panel header="Meta" key="5">
              <Form.List name="metadata">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key} style={{display: "flex"}} className={styles['wrapper-input']}>
                        <Form.Item
                          label="Ключ"
                          key={`${field.key}-key`}
                          name={[field.name, 'key']}
                          rules={[{ required: true, message: 'Введите ключ' }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="Значение"
                          key={`${field.key}-value`}
                          name={[field.name, 'value']}
                          rules={[{ required: true, message: 'Введите значение' }]}
                        >
                          <Input />
                        </Form.Item>
                        <Button danger onClick={() => remove(field.name)}><CloseOutlined /></Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Добавить ещё ключ - значение
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Panel>
          </Collapse>
        </Form>
      </Modal>
    </>
  )
}
