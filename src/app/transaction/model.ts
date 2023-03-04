import { FilterBase } from "../shared/Filter-base";
import { DateHelper } from "../utils/datetime.helper";
import { NumberFormatPipe } from "../utils/number-format.pipe";

export class SearchTransactionResponse {

	public constructor(init?: Partial<SearchTransactionResponse>) {
		this.Transactions = init.Transactions ? init.Transactions.map(t => new Transaction(t)) : [];
		this.TotalRecords = init.TotalRecords;
	}

	Transactions: Transaction[];
	TotalRecords: number;
}

export class Transaction {

	public constructor(init?: Partial<Transaction>) {
		Object.assign(this, init);
	}

	selected: boolean;
	RECORD_TYPE: string;
	PKEY: number;
	EAN: string;
	ARN: string;
	SUPPLIER_ID: number;
	GRD_ID: number;
	AMOUNT: number;
	FILE_REF: string;
	LINE_ID: number;
	EXPORT_SEQ: number;
	TRANS_NUM: number;
	TERMINAL_ID: string;
	AMOUNT_TYPE: number;
	ENERGY: string;
	TIME_STAMP: string;
	CORRECTION_LEVEL: number;
	SUPPLIER_NAME: string;
	DISTRIBUTOR_NAME: string;
	FTRANS_CORRECTION: number;
	F_TRANS_MAN: string;
	STATUS?: number;

	get amount(): number {
		return this.AMOUNT === null || this.AMOUNT_TYPE === 0 ? this.AMOUNT : -this.AMOUNT;
	}

	get type(): string {
		return this.AMOUNT_TYPE === 0 ? 'CR' : 'REV';
	}

	statusDescription(): string {
		if (this.RECORD_TYPE === 'T') {
			return this.FILE_REF ? 'Envoyé' : 'En attente';
		}

		switch (this.STATUS) {
			case 92:
			case 93:
				return 'Envoi en cours';
			case 94:
				return 'Envoyé';
			case 95:
				return 'En attente';
			case 96:
				return 'A renvoyer';
			case null:
				return '';
			default:
				return '?';
		}
	}

	transactionToString(): string {
		return `${this.CORRECTION_LEVEL || ''};
${this.statusDescription()};
${this.FILE_REF || ''};
${this.LINE_ID || ''};
${this.EAN || ''};
${NumberFormatPipe.transform(this.amount)};
${this.type || ''};
${this.ENERGY || ''};
${this.ARN || ''};
${this.SUPPLIER_ID || ''};
${this.SUPPLIER_NAME || ''};
${this.GRD_ID || ''};
${this.DISTRIBUTOR_NAME || ''};
${this.timeStamp};
${this.TRANS_NUM || ''}`;
	}

	export(): object {
		return {
			'Niveau': this.CORRECTION_LEVEL,
			'Status': this.statusDescription(),
			'Référence fichier': this.FILE_REF,
			'N° de ligne': this.LINE_ID,
			'EAN': this.EAN,
			'Montant (€)': this.AMOUNT,
			'Type': this.AMOUNT_TYPE,
			'Energie': this.ENERGY,
			'ARN': this.ARN,
			'Fournisseur': this.SUPPLIER_ID,
			'GRD': this.GRD_ID,
			'Date et heure de chargement': this.timeStamp,
			'N° de transaction': this.TRANS_NUM
		};
	}

	get timeStamp(): string {
		return this.TIME_STAMP.replace(/(\d{4})-(\d{2})-(\d{2})T(.{8})/, '$3/$2/$1 $4');
	}
}

export class TransactionHierarchyEntry {

	public constructor(init?: Partial<TransactionHierarchyEntry>) {
		Object.assign(this, init);
	}

	LEVEL: number;

	RECORD_TYPE: string;
	FILE_REF: string;
	LINE_ID?: number;
	EAN: string;
	AMOUNT: number;
	AMOUNT_TYPE: number;
	ARN: string;
	SUPPLIER_ID: number;
	GRD_ID: number;
	SUPPLIER_NAME: string;
	DISTRIBUTOR_NAME: string;

	EXPORT_SEQ: number;
	TRANS_NUM: number;
	TERMINAL_ID: string;
	ENERGY: string;
	TIME_STAMP: string;
	CORRECTION_LEVEL: number;
	USERID: string;
	ID: number;
	PARENT_ID: number;
	STATUS?: number;

	statusDescription(): string {
		if (this.RECORD_TYPE === 'T') {
			return this.FILE_REF ? 'Envoyé' : 'En attente';
		}

		switch (this.STATUS) {
			case 92:
			case 93:
				return 'Envoi en cours';
			case 94:
				return 'Envoyé';
			case 95:
				return 'En attente';
			case 96:
				return 'A renvoyer';
			case null:
				return '';
			default:
				return '?';
		}
	}

	get amount(): number {
		return this.AMOUNT === null || this.AMOUNT_TYPE === 0 ? this.AMOUNT : -this.AMOUNT;
	}

	get type(): string {
		return this.AMOUNT_TYPE === 0 ? 'CR' : 'REV';
	}

	get timeStamp(): string {
		return this.TIME_STAMP.replace(/(\d{4})-(\d{2})-(\d{2})T(.{8})/, '$3/$2/$1 $4');
	}

	getCorrection(): Correction {
		const correction = new Correction();
		correction.TransactionId = this.ID;
		correction.AMOUNT = this.AMOUNT;
		correction.ARN = this.ARN;
		correction.EAN = this.EAN;
		correction.GRD_ID = this.GRD_ID;
		correction.SUPPLIER_ID = this.SUPPLIER_ID;
		correction.FILE_REF = this.FILE_REF;
		correction.LINE_ID = this.LINE_ID;
		return correction;
	}

	export(): object {
		return {
			'Niveau': this.CORRECTION_LEVEL,
			'Status': this.statusDescription(),
			'Référence fichier': this.FILE_REF,
			'N° de ligne': this.LINE_ID,
			'EAN': this.EAN,
			'Montant (€)': this.amount,
			'Type': this.type,
			'Energie': this.ENERGY,
			'ARN': this.ARN,
			'Fournisseur': `${this.SUPPLIER_ID} - ${this.SUPPLIER_NAME}`,
			'GRD': `${this.GRD_ID} - ${this.DISTRIBUTOR_NAME}`,
			'Date et heure de chargement': this.timeStamp,
			'Utilisateur': this.USERID
		};
	}
}

export class TransactionsFilter extends FilterBase {
	public constructor(status: string, init: Partial<TransactionsFilter>) {
		super();
		Object.assign(this, init);
		this.STATUS = status;
	}

	STATUS: string;
	EAN?: string;
	ARN?: string;
	FILE_REF?: string;
	LINE_ID?: number;
	BeginDate?: string;
	EndDate?: string;
	SUPPLIER_ID?: number;
	GRD_ID?: number;
	ENERGY?: string;

	clone(): TransactionsFilter {
		const c = new TransactionsFilter(this.STATUS, this);
		c.BeginDate = DateHelper.toIsoDate(c.BeginDate);
		c.EndDate = DateHelper.toIsoDate(c.EndDate);
		return c;
	}

	override clear(): void {
		const status = this.STATUS;
		super.clear();
		this.STATUS = status;
	}	
}

export class TransactionHierarchyFilter {
	ID: number;
}

export class Correction {
	TransactionId: number;
	EAN: string;
	ARN: string;
	SUPPLIER_ID: number;
	GRD_ID: number;
	AMOUNT: number;
	FILE_REF: string;
	LINE_ID: number;

	clone(): Correction {
		return {...this};
	}
}

export class Supplier {
	public constructor(init?: Partial<Supplier>) {
		Object.assign(this, init);
	}

	Id: number;
	Name: string;
	getDescription() { return `${this.Id}-${this.Name}`; }
}

export class Distributor {
	public constructor(init?: Partial<Distributor>) {
		Object.assign(this, init);
	}

	Id: string;
	Name: string;
	getDescription() { return `${this.Id}-${this.Name}`; }
}

export class TransactionHierarchyNode {
	public constructor(entry: TransactionHierarchyEntry) {
		this.entry = entry;
		this.children = [];
		this.parent = undefined;
		this.last = true;
		this.error = false;
		this.level = 0;
	}

	entry: TransactionHierarchyEntry;
	children: TransactionHierarchyNode[];
	parent: TransactionHierarchyNode;
	last: boolean;
	error: boolean;
	level: number;
	boxes: string[];

	get reversible(): boolean {
		if (this.entry.RECORD_TYPE === 'T') {
			return this.entry.AMOUNT_TYPE === 0
				&& this.entry.FILE_REF 
				&& this.children.length === 0;
		} 
		return this.entry.AMOUNT_TYPE === 0
			&& this.entry.STATUS === 94
			&& this.children.length === 0;
	}

	get cancelable(): boolean {

        if (   this.entry.RECORD_TYPE == 'C'             // if correction
		    && this.entry.STATUS === 95                  // not already sent
			&& this.children.length === 0)               // with no sub-correction 
		{ 
			if (this.entry.AMOUNT_TYPE === 0) {          // if type CR
				return true;                             // then it can be canceled
			}
			if (this.entry.AMOUNT_TYPE === 1             // if type REV
				&& this.parent                           // it must have a parent
				&& this.parent.children.length === 1) {  // if there is no CR correspondant
				return true;                             // then it can be canceled
			}
        }

		return false;                                   // cancel all other cases
	}

	addChild(child: TransactionHierarchyNode): void {
		child.error = this.entry.AMOUNT_TYPE !== 0; // child correction added to a credit transaction
		if (child.entry.AMOUNT_TYPE === 0) { // put debit transaction after credit ones
			this.children.push(child);
		} else {
			this.children.unshift(child);
		}
		child.parent = this;
	}
}

export class TransactionReversal {
	ID: number;
}

export class ResubmitTransactionRequest {
	TransactionIds: number[];
	CorrectionIds: number[];
}
