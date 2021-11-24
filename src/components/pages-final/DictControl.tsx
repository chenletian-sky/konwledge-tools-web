import React, { Component } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom'
// antd组件库
import { Layout, Menu, Button, message, Avatar, Dropdown, Select, Progress, Descriptions, Space, Divider, Modal, Spin, Alert, Form, Input, Checkbox, Upload, Table } from 'antd';
import 'antd/dist/antd.css';
import { UploadOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import Icon, { UserOutlined } from '@ant-design/icons';
// 自定义icon
import { DictionaryIcon, TrainIcon,DataVisualIcon, LabelIcon, MenuLabelIcon, Logo, SaveIcon, importIcon } from './../Icon';
// redux
import { connect } from 'react-redux';
import { MainStoreType, StoreType, TableDataType, TextsDataType ,MenuStoreType, TextViewStoreType, MarkViewStoreType, InitMarkText, DictionaryViewStoreType} from '../../types/propsTypes';
import { identifyEntity,changeMenuSelect, setLoadingState, updateAllDictionaryData, updateAllTextsData, updateDictionaryData, updateLabelByShow, updateMarkTextData, updateTextsData, modifyLabelOfDictionaryData } from '../../action';
// 路由页面
import DictionaryView from './../DictionaryView';
import TextView from './../TextView';
import MarkView from './../MarkView';
import DataVisualView from './../DataVisualView';
// 工具库
import $ from 'jquery'
import XLSX from 'xlsx'
import axios, { AxiosResponse } from 'axios';
// 后端路径
import { PATH } from '../../types/actionTypes';
import { type } from 'os';
import TrainView from './../TrainView';
import MyPieChart from './../EchartComponents/MyPieChart';
import BatteryCharge from './../Animation/BatteryCharge';
import MyProcess from './../Animation/MyProcess';
import ClusteringPlot from './../ClusteringPlot/index';
import WordCloud from './../WordCloud/yu/index';
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';

import {  Result, Statistic } from 'antd';
import { LikeOutlined,  } from '@ant-design/icons';

import type { BasicLayoutProps, ProSettings } from '@ant-design/pro-layout';
import ProLayout, { PageContainer, SettingDrawer } from '@ant-design/pro-layout';
import defaultProps from './../_defaultProps';
import ProCard from '@ant-design/pro-card';
import TextArea from 'antd/lib/input/TextArea';
import { ColumnType } from 'antd/lib/table';


interface DictControlProps extends MainStoreType,DictionaryViewStoreType{
  // updateAllTextsData: typeof updateAllTextsData,
  updateAllDictionaryData: typeof updateAllDictionaryData,
//   updateLabelByShow: typeof updateLabelByShow,
  updateDictionaryData: typeof updateDictionaryData,
  // updateTextsData: typeof updateTextsData,
}
interface DictControlState {

}
class DictControl extends Component <DictControlProps, DictControlState>{
    public constructor(props : DictControlProps) {
        super(props)
    }

    public render() : JSX.Element {
        return (
            <ProCard
              // title="左右分栏带标题"
              // extra="2019年9月28日"
              split='vertical'
              bordered
              headerBordered
              style={{
                height:"100%",
                width:"100%"
              }}
            >
              <ProCard 
              // title="左侧详情" 

              colSpan="50%">
                <div
                  style={{
                    height:"50%",
                    width:"100%",
                    border:"1px solid black",
                    padding:"10px 10px 10px 10px"
                  }}
                >
                  <div
                    style={{
                      // margin:"10px 10px 10px 10px"
                    }}
                  >
                    <span
                    style={{
                      position:'relative',
                      top:"-24px",
                      zIndex:99,
                      backgroundColor:"white",
                      fontSize:"20px"
                    }}
                  >新增字典</span>
                  </div>
                  
                  <Form
                    name="basic"
                    // labelCol={{ span: 8 }}
                    wrapperCol={{ span: 8 }}
                    // initialValues={{ remember: true }}
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={{
                      // fontSize:"20px"
                    }}
                  >
                    <Form.Item
                      label="字典名称"
                      
                      name="dictName"
                      rules={[{ required: true }]}
                      
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="字典描述"
                      name="dictDescribe"
                      rules={[{ required: true }]}
                      wrapperCol={{span:20}}
                    >
                      <TextArea
                        style={{
                          height:"100px",
                          width:"400px"
                        }}
                        autoSize={false}
                      ></TextArea>
                      {/* <Input.Password /> */}
                    </Form.Item>

                    <Form.Item
                      label="导入文件"
                      name="dictFile"
                      rules={[{ required: true  }]}
                    >
                      <Upload 
                      // {...props}
                      >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      </Upload>
                    </Form.Item>

                    

                    <Form.Item 
                      wrapperCol={{ offset: 8, span: 16 }}
                    >
                      <Space>
                        <Button type="primary" htmlType="submit">
                          文件校验
                        </Button>
                        <Button type="primary" htmlType="submit">
                          新增字典
                        </Button>
                      </Space>
                      
                    </Form.Item>

                    {/* <Form.Item 
                      // wrapperCol={{ offset: 8, span: 16 }}
                    >
                      
                    </Form.Item> */}
                  </Form>
                </div>
                
                <div
                  style={{
                    height:"50%",
                    width:"100%",
                    marginTop:"10px"
                    // backgroundColor:"red"
                  }}
                >
                  <Table 
                    style={{
                      // fontSize:"20px"
                    }}
                    // onHeaderRow = { 
                    //   { size: "20px" 
                    // }
                    // onHeaderRow ={(index,record)=>{
                    //   return <p></p>
                    // }}
                    columns={
                      [
                        {
                          title: '字典名称',
                          
                          dataIndex: 'name',
                          key: 'name',
                          width:"20%",
                          render: text => <a
                            style={{fontSize:"20px"}}
                          >{text}</a>,
                        },
                        {
                          title: '字典描述',
                          dataIndex: 'describe',
                          width:"30%",
                          key: 'age',
                          render:text => <a style={{fontSize:"20px"}}>{text}</a>
                        },
                        {
                          title: '包含语量',
                          dataIndex: 'size',
                          width:"10%",
                          key: 'address',
                        },
                        {
                          title: '字典容量',
                          key: 'capacity',
                          width:"10%",
                          dataIndex: 'capacity',
                          // render: tags => (
                          //   <React.Fragment>

                          //   </React.Fragment>
                          // ),
                        },
                        {
                          title: '操作',
                          key: 'action',
                          width:"30%",
                          align:"center",
                          render: (text, record) => (
                            <Space size="middle">
                              {/* <a>Invite {record.name}</a> */}
                              <a>更新</a>
                              <a>导出</a>
                              <a>查看</a>
                            </Space>
                          ),
                        },
                      ]
                    } 
                    dataSource={
                      [
                        {
                          key: '1',
                          name: 'dict_name',
                          describe: 'describe',
                          size: '10000',
                          capacity: '100k',
                        },
                        {
                          key: '2',
                          name: 'dict_name_2',
                          describe: 'describe_2',
                          size: '8000',
                          capacity: '80k',
                        },
                        {
                          key: '3',
                          name: 'dict_name_3',
                          describe: 'describe_3',
                          size: '6000',
                          capacity: '60k',
                        }
                      ]
                    } 
                  />

                </div>
              </ProCard>
              <ProCard 
              // title="查看详情"
              >
                <div 
                    style={{ 
                      height: "100%" 
                    }}
                  >
                    <div
                    style={{
                      height:"100%",
                      width:"100%",
                      border:"1px solid black",
                      padding:"10px 10px 10px 10px"
                    }}
                  >
                    <div
                      style={{
                        // margin:"10px 10px 10px 10px"
                        // height:"60%"
                      }}
                    >
                      <span
                        style={{
                          position:'relative',
                          top:"-24px",
                          zIndex:99,
                          backgroundColor:"white",
                          fontSize:"20px"
                      }}
                      >
                        查看详情
                      </span>
                    </div>
                      <DictionaryView/>
                    {/* <Switch>
                    <Route path="/index" component={DictionaryView} />
                    <Route path="/index/texts" component={TextView}/>
                    <Route path='/index/mark' component={MarkView} />
                    <Route path='/index/dataVisualization' component={DataVisualView} />


                    <Route path='/index/train' component={TrainView} />

                </Switch> */}

                  </div>
                  
                </div>
              </ProCard>
            </ProCard>
        )
    }

    componentDidMount(){
      // const {} = this.props
    }
}

const mapStateToProps = (state: StoreType, ownProps?: any) => {
  const { DictionaryView ,Main} = state;
  // console.log(Header)
  return {
    ...ownProps,
    ...DictionaryView,
    Main:Main
  };
};

const mapDispatchToProps = {
  updateDictionaryData,
  modifyLabelOfDictionaryData,
};




export default connect(mapStateToProps,mapDispatchToProps)(DictControl)