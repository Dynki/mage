import { NFTSetHistory } from "prisma/prisma-client"
import { MdSwapHoriz } from "react-icons/md"
import { CollapsePanel } from "@/lib/components/controls/CollapsePanel"
import { Column, Row, Table, TableHeader } from "@/lib/components/controls/Table"

type NftSetHistoryProps = {
  history: NFTSetHistory[]
}

export const NftSetHistory = ({ history }: NftSetHistoryProps) => {
  
  if (!history.length) return null

  return (
    <CollapsePanel
      label="Item Activity"
      classesOverride="p-0 md:p-0"
      collapsible={true}
      icon={<MdSwapHoriz size={30} className="fill-gray-700 dark:fill-gray-400 rotate-90"/>}
    >
      <Table>
        <TableHeader>
          <Column><div>Event Type</div></Column>
          <Column><div>Quantity</div></Column>
          <Column><div>From</div></Column>
          <Column><div>To</div></Column>
          <Column><div>Date</div></Column>
        </TableHeader>
        <>
          {history.map(eventItem => (
            <Row key={eventItem.id}>
              <Column><div className="w-full">{eventItem.eventType}</div></Column>
              <Column><div>{eventItem.quantity.toString()}</div></Column>
              <Column><div>{eventItem.fromAdminWallet ? "Mage" : eventItem.walletFromId}</div></Column>
              <Column><div>{eventItem.walletToId}</div></Column>
              <Column><div>{new Date(eventItem.createdAt).toLocaleDateString()}</div></Column>
            </Row>
          ))}
        </>
      </Table>
    </CollapsePanel>
  )
}
