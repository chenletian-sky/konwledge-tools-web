import React, { Component, Key } from 'react';
import { Input, Modal, Table, Tag, Popover, Button } from 'antd';
import 'antd/dist/antd.css';
import Icon, { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import $ from 'jquery'
import { ColorResult, SketchPicker } from 'react-color';
import { SettingIcon } from './../Icon';
import { connect } from 'react-redux';
import { FontObject, MarkTextsDataType, MarkViewStoreType, StoreType, TextsDataType } from '../../types/propsTypes';
import { changeMenuSelect, updateMarkTextData, updateTextTablePage, updateTrainData } from '../../action';
import { updateTextsData } from '../../action';
import axios, { AxiosResponse } from 'axios';
import { PATH } from '../../types/actionTypes';


interface ShowMarkTextProps extends MarkViewStoreType{
  history: any,
	// MarkView:MarkViewStoreType,
	TrainViewData:MarkViewStoreType,
	updateTextTablePage: typeof updateTextTablePage,
	updateMarkTextData: typeof updateMarkTextData,
	updateTextsData: typeof updateTextsData,
	updateTrainData: typeof updateTrainData,
	changeMenuSelect:typeof changeMenuSelect
}
interface ShowMarkTextState {
  editKey: string,
	labels: Array<{
		color: string,
		name: string,
		key: string
	}>,
	inputVisible: boolean,
	labelSettingConfig: {
		label: string,
		color: string,
		key: string
	},
	popoverVisibleName: string,
	selectedRowKeys: Array<Key>,
	selectedRows: MarkTextsDataType,
}
class ShowMarkText extends Component <ShowMarkTextProps, ShowMarkTextState>{
    private startIndex: number | undefined
    private endIndex: number | undefined
    private columns: any
    private input: any
    public constructor(props : ShowMarkTextProps) {
        super(props)
        this.startIndex = -1
        this.endIndex = -1
        this.state = {
          editKey: '',
          inputVisible: false,
          popoverVisibleName: '',
          selectedRowKeys: [],
          selectedRows: [],
          labelSettingConfig: {
            label: '',
            color: '',
            key: '',
          },
          labels: [
            {
              color: '#516b91',
              name: '人名',
              key: 'p'
            }, {
              color: '#59c4e6',
              name: '地名',
              key: 'd'
            }, {
              color: '#edafda',
              name: '时间',
              key: 't'
            }, {
              color: '#d1c7b7',
              name: '设备',
              key: 'e'
            }
          ],
        }
        this.columns = [
          {
            title: <div style={{
              width: '100%',
              textAlign: 'center'
            }}>
              文本
            </div>,
            dataIndex: 'textArr',
            key: 'text',
            align: 'left',
            render: (text: Array<FontObject>, record: unknown, index: number) => {
              const { data, current, updateMarkTextData, updateTextsData } = this.props
              return (
                <div 
                  style={{
                    fontSize:"20px"
                  }}
                >
                  {
                    text.map((value: FontObject, i: number) => {
                      // console.log('r', labelRecord)
                      // const recordIndex = labelRecord[current * 10 - 10 + index].findIndex((r: { start: number; end: number; label: string; text: string; color: string }) => r['text'] === value )
                      if (!value['text']) return '';
                      if (value['text'].length <= 1 && value['label'] === 'none') {
                        return (
                          <div key={i} style={{
                            display: 'inline-block',
                          }} onMouseDown={
                            () => {
                              this.startIndex = i
                            }
                          } onMouseOver={
                            () => {
                              this.endIndex = i
                            }
                          } onMouseUp={
                            () => {
                              this.endIndex = i
                            }
                          }>
                            {value['text']}
                          </div>
                        )
                      } else {
                        return (
                          <Tag key={i} color={value['color']} 
                          closable
                            icon={<Icon component={SettingIcon} onClick={
                              () => {
                                
                              }
                            } />}
                            style={{
                              marginLeft: '5px'
                            }} onClose={
                              () => {
                                // const { data, current, updateMarkTextData } = this.props
                                const arr: Array<FontObject> = value['text'].split('').map((str: string, index: number) => ({
                                  text: str,
                                  start: value['start'] + index,
                                  end: value['start'] + index,
                                  label: 'none',
                                  color: 'blue'
                                }))
                                data[current * 10 - 10 + index]['textArr'].splice(i, 1)
                                // console.log(v, v.split(''));
                                data[current * 10 - 10 + index]['textArr'].splice(i, 0, ...arr)
                                // delete nameToColor[value]
                                // labelRecord[current * 10 - 10 + index] = labelRecord[current * 10 - 10 + index].filter((value: { start: number; end: number; label: string; text: string; color: string }) => (
                                //   value['text'] !== v
                                // ))
                                // console.log('.....', labelRecord)
                                // labelRecord[current * 10 - 10 + index].splice(j, 1)
                                // updateMarkRecord(labelRecord)
                                updateMarkTextData([...data])
                                updateTextsData([...data])
                                // this.setState({  })
                              }
                            }>
                            {value['text']}
                          </Tag>
                        )
                      }
                    })
                  }
                </div>
              )

            }
          }
        ]
    }

    public render() : JSX.Element {
        const { labels, inputVisible, labelSettingConfig, popoverVisibleName, selectedRowKeys, selectedRows } = this.state
        const { history, current, data, updateTextTablePage, updateTextsData, updateTrainData, updateMarkTextData,changeMenuSelect } = this.props
        const {TrainViewData} = this.props
                return (
          <div style={{
            width: '100%',
            height: '500px',
            // backgroundColor: 'red'
            // borderBottom: '1px solid black'
          }}>
            
            <div style={{
              width: '100%',
              height: '50px',
              padding: '10px',//rgb(255, 255, 255)
              // backgroundColor: 'red'
              // position: 'absolute'
            }}>
              {
                labels.map((value: { color: string; name: string; key: string; }, index: number) => (
                  <Popover title='标签设置' visible={popoverVisibleName === value['name']} key={'label' + index}
                    placement='bottomLeft'
                    content={
                      <div style={{
                        width: '100%',
                        height: '100px',
                        lineHeight: '30px',
                        // backgroundColor: 'red',
                      }}>
                        <div style={{
                          height: '30px'
                        }}>
                          标签名：<Input value={labelSettingConfig.label} size='small' onChange={
                            (e) => {
                              labelSettingConfig.label = e.target.value
                              this.setState({ labelSettingConfig: { ...labelSettingConfig } })
                            }
                          } style={{
                            width: '100px'
                          }} />
                        </div>
                        <div style={{
                          height: '30px'
                        }}>
                          快捷键：
                          <div style={{
                            display: 'inline-block',
                            // backgroundColor: 'blue',
                            height: '30px'
                          }}>
                            Ctrl + &nbsp;
                          </div>
                          <Input maxLength={1} value={labelSettingConfig.key} size='small' onChange={
                            (e) => {
                              labelSettingConfig.key = e.target.value
                              this.setState({ labelSettingConfig: { ...labelSettingConfig } })
                            }
                          } style={{
                            width: '30px'
                          }} />
                        </div>
                        <div style={{
                          height: '30px',
                          // po
                        }}>
                          颜色：
                          <Popover title='拾色器' placement='left' trigger='click'
                            content={
                              <SketchPicker color={labelSettingConfig.color}
                                onChange={
                                  (color: ColorResult) => {
                                    labelSettingConfig.color = color.hex
                                    this.setState({ labelSettingConfig })
                                  }
                                }
                              />
                            }
                          >
                            <div style={{
                              width: '20px',
                              height: '20px',
                              transform: 'translate(15px, 5px)',
                              display: 'inline-block',
                              backgroundColor: labelSettingConfig.color
                            }}></div>
                          </Popover>
                          <Button type='primary' size='small' style={{
                            float: 'right',
                            transform: 'translate(-5px, 2.5px)',
                          }} onClick={
                            () => {
                              
                            }
                          }>
                            确定
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <Tag 
                      closable={false}
                      color={value['color']} key={'name' + index}
                      icon={<Icon component={SettingIcon} onClick={
                        () => {
                          const labelSettingConfig = {
                            label: value['name'],
                            color: value['color'],
                            key: value['key']
                          }
                          const name = popoverVisibleName === value['name'] ? '' : value['name']
                          this.setState({ labelSettingConfig, popoverVisibleName: name })
                        }
                      } />}
                      style={{
                        userSelect: 'none'
                      }}
                      onClose={
                        (e) => {
                          e.preventDefault()
                          Modal.confirm({
                            title: '警告',
                            icon: <ExclamationCircleOutlined />,
                            content: '请确认是否要删除标签：' + value['name'],
                            okText: '确认',
                            cancelText: '取消',
                            onOk: () => {
                              labels.splice(index, 1)
                              this.setState({ labels })
                            }
                          });
                        }
                      }>
                      {value['name'] + ' [' + value['key'] + ']'}
                    </Tag>
                  </Popover>
                ))
              }
            
            </div>
            
            <Table columns={this.columns} dataSource={data} size='small' 
              scroll={{ y: 360 }}
              pagination={{
                pageSize: 6,
                current,
                simple: true,
                position: ['bottomRight'],
                // showSizeChanger: true,
                onChange: (page: number) => {
                  updateTextTablePage(page)
                  // this.setState({ pageSize: (pageSize as number) })
                }
              }}
              rowSelection={{
                selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                  // console.log("rowChange",selectedRowKeys,selectedRows)
                  this.setState({ selectedRowKeys, selectedRows })
                  // console.log(selectedRowKeys, selectedRows)
                }
                
              }}
            />
    
            
          </div>
        )
    }
}

const mapStateToProps = (state:StoreType, ownProps?: any) => {
	const { MarkView ,TrainView} = state
	// console.log(Header)
	return {
			...ownProps,
			...MarkView,
			TrainViewData:TrainView
	}
}

const mapDispatchToProps = {
  updateTextTablePage,
	updateMarkTextData,
	updateTextsData,
	updateTrainData,
	changeMenuSelect
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowMarkText);
// export default ShowMarkText;